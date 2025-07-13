import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
    const body = await req.json();

    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/, '');
    console.log(token);

    const edgeRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/createBooking`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        }
    );


    // Read text first
    console.log(edgeRes);
    const text = await edgeRes.text();
    console.log("text",text)

    // Try to JSON‑parse, else use text as message
    let data: any;
    try {
        data = JSON.parse(text);
        console.log("data",data);
    } catch {
        data = { error: text };
    } return NextResponse.json(data, { status: edgeRes.status });
}
