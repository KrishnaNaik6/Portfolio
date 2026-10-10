import { NextResponse } from 'next/server';
import { fetchNexisPortfolioResult } from '@/lib/nexis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await fetchNexisPortfolioResult();
    const data = result.data;
    const hasDetails = Boolean(data && data.details);
    const enabledSections = data?.sections?.filter((s) => s.enabled) ?? [];
    const sectionCount = enabledSections.length;
    const isValidPublished = result.status === 'published' && hasDetails && sectionCount > 0;

    if (isValidPublished && data) {
      console.log(
        `[Portfolio API] Portfolio data retrieved successfully: status=${result.status}, statusCode=${result.statusCode ?? 200}, schemaSuccess=${result.schemaSuccess ?? true}, hasDetails=${hasDetails}, sectionCount=${sectionCount}, correlationId=${result.correlationId || 'none'}`
      );

      const responseHeaders: Record<string, string> = {
        'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
      };
      if (result.correlationId) {
        responseHeaders['X-Correlation-ID'] = result.correlationId;
      }
      return NextResponse.json(data, {
        headers: responseHeaders,
      });
    }

    // Determine specific failure category
    let category = result.errorCategory;
    if (!category) {
      if (result.status === 'published') {
        category = !hasDetails || sectionCount === 0 ? 'empty_sections' : 'upstream_unavailable';
      } else {
        category = 'upstream_unavailable';
      }
    }

    console.warn(
      `[Portfolio API] Portfolio data unavailable: status=${result.status}, statusCode=${result.statusCode ?? 'unknown'}, schemaSuccess=${result.schemaSuccess ?? false}, hasDetails=${hasDetails}, sectionCount=${sectionCount}, category=${category}, correlationId=${result.correlationId || 'none'}`
    );

    const responseHeaders: Record<string, string> = {
      'Cache-Control': 'no-store, must-revalidate',
    };
    if (result.correlationId) {
      responseHeaders['X-Correlation-ID'] = result.correlationId;
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Portfolio data currently unavailable from NEXIS upstream',
        category,
        ...(result.correlationId ? { correlationId: result.correlationId } : {}),
      },
      {
        status: 503,
        headers: responseHeaders,
      }
    );
  } catch (err) {
    console.error(
      '[Portfolio API] Unexpected exception in route handler:',
      err instanceof Error ? err.message : 'Unknown error'
    );
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        category: 'internal_error',
      },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
      }
    );
  }
}


