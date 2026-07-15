'use server';

import { groqJSON } from '@/ai/genkit';

export type AiCodeCompletionInput = {
  currentCode: string;
  cursorPosition: number;
  language: string;
};

export type AiCodeCompletionOutput = {
  suggestions: string[];
  explanation: string;
};

export async function aiCodeCompletion(input: AiCodeCompletionInput): Promise<AiCodeCompletionOutput> {
  const before = input.currentCode.slice(0, input.cursorPosition);
  const after = input.currentCode.slice(input.cursorPosition);

  return groqJSON<AiCodeCompletionOutput>(
    `You are an intelligent code completion assistant for a mobile code editor.`,
    `Language: ${input.language}

Code before cursor:
\`\`\`
${before}
\`\`\`

Code after cursor:
\`\`\`
${after}
\`\`\`

Provide up to 3 relevant completions at the cursor position. Return JSON: { "suggestions": ["...", "...", "..."], "explanation": "..." }`
  );
}
