import { NextRequest, NextResponse } from 'next/server';
import { aiErrorExplanationAndFix } from '@/ai/flows/ai-error-explanation-and-fix';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = await aiErrorExplanationAndFix(body);
    return NextResponse.json(result);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
