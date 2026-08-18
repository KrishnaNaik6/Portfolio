import { NextResponse } from 'next/server';
import { fetchGitHubDetails } from '@/lib/github';

export async function GET() {
  try {
    const details = await fetchGitHubDetails();
    if (!details) {
      return NextResponse.json({ error: 'Failed to fetch details' }, { status: 404 });
    }
    return NextResponse.json(details, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
