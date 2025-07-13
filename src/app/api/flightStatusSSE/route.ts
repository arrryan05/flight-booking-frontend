import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const edgeRes = await fetch(
    `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/flightStatusSSE`,
    { headers: { 'Accept': 'text/event-stream' } }
  );
  return new NextResponse(edgeRes.body, {
    status: edgeRes.status,
    headers: { 'Content-Type': 'text/event-stream' },
  });
}
