import { NextRequest, NextResponse } from 'next/server';
import { fetchGitHubUserStats } from '@/lib/github';
import { fetchNexisGitHubIntelligence } from '@/lib/nexis';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ username: string }> }
) {
  try {
    const { username } = await params;
    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year') || undefined;

    // For default portfolio user, attempt to fetch from NEXIS GitHub Intelligence endpoint first
    if (username.toLowerCase() === 'krishnanaik6') {
      const nexisIntel = await fetchNexisGitHubIntelligence(year);
      if (nexisIntel && nexisIntel.user) {
        return NextResponse.json(nexisIntel, {
          headers: {
            'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
          },
        });
      }
    }

    const data = await fetchGitHubUserStats(username);
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600',
      },
    });
  } catch (error: any) {
    if (error.message?.includes('Rate Limit')) {
      return NextResponse.json({ error: 'API Rate Limit Exceeded.' }, { status: 403 });
    }
    if (error.message?.includes('not found')) {
      return NextResponse.json({ error: 'User node not found.' }, { status: 404 });
    }
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
