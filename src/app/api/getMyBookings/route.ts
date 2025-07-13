import { NextRequest, NextResponse } from 'next/server';

const PROJECT_REF = process.env.NEXT_PUBLIC_SUPABASE_URL!.replace('https://', '');

export async function GET(req: NextRequest) {
    const authHeader = req.headers.get('authorization') || '';
    const token = authHeader.replace(/^Bearer\s+/, '');
    console.log(token);

    const edgeRes = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/getMyBookings`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await edgeRes.json();
    return NextResponse.json(data, { status: edgeRes.status });
}
