import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest){
  const token = req.headers.get('authorization')||'';
  const body = await req.json();
  const edge = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/createRoundTrip`, {
    method:'POST',
    headers:{ 'Content-Type':'application/json', Authorization:token },
    body: JSON.stringify(body)
  });
  const text = await edge.text();
  try { return NextResponse.json(JSON.parse(text),{status:edge.status}); }
  catch { return NextResponse.json({error:text},{status:edge.status}); }
}
