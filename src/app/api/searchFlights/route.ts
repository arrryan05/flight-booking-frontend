import { NextRequest, NextResponse } from 'next/server';
const PROJECT = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://','');
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const edgeRes = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/searchFlights?${url.searchParams.toString()}`
  );
  const text = await edgeRes.text();
  try {
    return NextResponse.json(JSON.parse(text), { status: edgeRes.status });
  } catch {
    return NextResponse.json({ error: text }, { status: edgeRes.status });
  }
}
