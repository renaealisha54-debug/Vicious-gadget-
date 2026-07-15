'use server';

import { groqChat } from '@/ai/genkit';

export type AiCodeSnippetGenerationInput = {
  language: string;
  description: string;
};

export type AiCodeSnippetGenerationOutput = {
  codeSnippet: string;
};

export async function aiCodeSnippetGeneration(input: AiCodeSnippetGenerationInput): Promise<AiCodeSnippetGenerationOutput> {
  const codeSnippet = await groqChat(
    `You are an expert software developer. Generate precise, ready-to-use code snippets. Always wrap output in a markdown code block with the correct language tag.`,
    `Generate a ${input.language} code snippet for: ${input.description}`
  );
  return { codeSnippet };
}
