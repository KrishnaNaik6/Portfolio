import { NextResponse } from 'next/server';
import { getGitHubHeaders } from '@/lib/github';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const response = await fetch('https://api.github.com/users/KrishnaNaik6/repos?per_page=100', {
      headers: getGitHubHeaders(),
      next: { revalidate: 3600 },
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}

