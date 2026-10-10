import { NextResponse } from 'next/server';
import { fetchNexisPortfolioResult } from '@/lib/nexis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await fetchNexisPortfolioResult();
    const data = result.data;
    const hasDetails = result.hasDetails ?? Boolean(data && data.details);
    const normalizedSectionCount =
      result.normalizedSectionCount ?? (data?.sections?.filter((s) => s.enabled).length ?? 0);
    const isValidPublished =
      result.status === 'published' &&
      hasDetails &&
      normalizedSectionCount > 0 &&
      !result.errorCategory;

    if (isValidPublished && data) {
      console.log(
        `[Portfolio API] Portfolio data retrieved successfully: source=${result.source ?? 'network'}, status=${result.status}, statusCode=${result.statusCode ?? 200}, envelopeType=${result.envelopeType ?? 'unknown'}, rawSectionCount=${result.rawSectionCount ?? 'unknown'}, rawEnabledSectionCount=${result.rawEnabledSectionCount ?? 'unknown'}, normalizedSectionCount=${normalizedSectionCount}, hasDetails=${hasDetails}, correlationId=${result.correlationId || 'none'}`
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
    const category =
      result.errorCategory ||
      (result.status === 'published' ? 'empty_sections' : 'upstream_unavailable');

    console.warn(
      `[Portfolio API] Portfolio data unavailable: source=${result.source ?? 'network'}, status=${result.status}, statusCode=${result.statusCode ?? 'unknown'}, envelopeType=${result.envelopeType ?? 'unknown'}, rawSectionCount=${result.rawSectionCount ?? 0}, rawEnabledSectionCount=${result.rawEnabledSectionCount ?? 0}, normalizedSectionCount=${normalizedSectionCount}, hasDetails=${hasDetails}, category=${category}, correlationId=${result.correlationId || 'none'}`
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


