import { NextRequest, NextResponse } from 'next/server';
const PROJECT = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://','');

export async function PATCH(req: NextRequest) {
  const token = req.headers.get('authorization')||'';
  const body = await req.json();
  const edgeRes = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/modifyBooking`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type':'application/json',
        Authorization: token,
      },
      body: JSON.stringify(body),
    }
  );
  const text = await edgeRes.text();
  let data;
  try { data = JSON.parse(text) } catch { data = { error: text } }
  return NextResponse.json(data, { status: edgeRes.status });
}
