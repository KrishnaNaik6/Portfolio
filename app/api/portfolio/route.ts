import { NextResponse } from 'next/server';
import { fetchNexisPortfolio } from '@/lib/nexis';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const data = await fetchNexisPortfolio();
    if (!data) {
      return NextResponse.json({ error: 'NEXIS portfolio data unavailable' }, { status: 404 });
    }

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        Pragma: 'no-cache',
        Expires: '0',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
