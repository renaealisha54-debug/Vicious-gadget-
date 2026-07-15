'use server';

import { groqJSON } from '@/ai/genkit';

export type AiErrorExplanationAndFixInput = {
  codeSnippet: string;
  errorMessage: string;
  programmingLanguage: string;
};

export type AiErrorExplanationAndFixOutput = {
  explanation: string;
  suggestedFix: string;
};

export async function aiErrorExplanationAndFix(input: AiErrorExplanationAndFixInput): Promise<AiErrorExplanationAndFixOutput> {
  return groqJSON<AiErrorExplanationAndFixOutput>(
    `You are an expert software developer. Explain errors clearly and provide concrete fixes.`,
    `Language: ${input.programmingLanguage}

Code:
\`\`\`
${input.codeSnippet}
\`\`\`

Error: ${input.errorMessage}

Return JSON: { "explanation": "...", "suggestedFix": "..." }`
  );
}
