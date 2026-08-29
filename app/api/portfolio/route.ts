import { NextResponse } from 'next/server';
import { fetchNexisPortfolio } from '@/lib/nexis';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await fetchNexisPortfolio();
    if (!data) {
      return NextResponse.json({ error: 'NEXIS portfolio data unavailable' }, { status: 404 });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
