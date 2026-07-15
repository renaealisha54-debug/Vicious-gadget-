import { NextRequest, NextResponse } from 'next/server';
import { aiCodeCompletion } from '@/ai/flows/ai-code-completion';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await aiCodeCompletion(body);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
