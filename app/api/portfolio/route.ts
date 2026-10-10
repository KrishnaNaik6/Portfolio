import { NextResponse } from 'next/server';
import { fetchNexisPortfolioResult } from '@/lib/nexis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const result = await fetchNexisPortfolioResult();
    const data = result.data;

    if (result.status === 'published' && data && data.details && data.sections && data.sections.length > 0) {
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
        category: result.errorCategory || 'upstream_unavailable',
        ...(result.correlationId ? { correlationId: result.correlationId } : {}),
      },
      {
        status: 503,
        headers: responseHeaders,
      }
    );
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : 'Unknown server error',
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

