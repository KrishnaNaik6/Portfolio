import { NextResponse } from 'next/server';
import { fetchNexisPortfolio } from '@/lib/nexis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchNexisPortfolio();
    if (data && data.details && data.sections && data.sections.length > 0) {
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Portfolio data currently unavailable from NEXIS upstream',
      },
      {
        status: 503,
        headers: {
          'Cache-Control': 'no-store, must-revalidate',
        },
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
