import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const gym = searchParams.get('gym');

  const response = await fetch(`https://api.cs-magic.cn/badminton?date=${date}&gym=${gym}`, {
    headers: {
      'User-Agent': 'BadmintonApp/1.0',
    },
  });

  const data = await response.json();
  return NextResponse.json(data);
}
