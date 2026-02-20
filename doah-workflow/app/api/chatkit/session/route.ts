// app/api/chatkit/session/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const WORKFLOW_ID = process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID;

  if (!OPENAI_API_KEY || !WORKFLOW_ID) {
    return NextResponse.json(
      { error: 'Missing env configuration' },
      { status: 500 }
    );
  }

  const body = await req.json();
  const { deviceId } = body;

  if (!deviceId) {
    return NextResponse.json(
      { error: 'Missing deviceId' },
      { status: 400 }
    );
  }

  try {
    const resp = await fetch('https://api.openai.com/v1/chatkit/sessions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'OpenAI-Beta': 'chatkit_beta=v1',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        workflow: { id: WORKFLOW_ID },
        user: deviceId,
      }),
    });

    if (!resp.ok) {
      const text = await resp.text();
      return NextResponse.json(
        { error: 'OpenAI session failed', detail: text },
        { status: 500 }
      );
    }

    const data = await resp.json();

    return NextResponse.json({
      client_secret: data.client_secret,
      expires_at: data.expires_at,
    });
  } catch (err) {
    return NextResponse.json(
      { error: 'Server error', detail: String(err) },
      { status: 500 }
    );
  }
}