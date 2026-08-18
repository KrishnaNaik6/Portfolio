import { NextResponse } from 'next/server';
import { fetchGitHubProjects } from '@/lib/github';

export async function GET() {
  try {
    const projects = await fetchGitHubProjects();
    return NextResponse.json(projects, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
