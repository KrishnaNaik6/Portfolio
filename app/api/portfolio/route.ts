import { NextResponse } from 'next/server';
import { fetchNexisPortfolio } from '@/lib/nexis';
import { FALLBACK_PORTFOLIO_DATA } from '@/lib/fallbackData';

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

    return NextResponse.json(FALLBACK_PORTFOLIO_DATA, {
      headers: {
        'Cache-Control': 'public, s-maxage=10, stale-while-revalidate=60',
      },
    });
  } catch {
    return NextResponse.json(FALLBACK_PORTFOLIO_DATA, { status: 200 });
  }
}
