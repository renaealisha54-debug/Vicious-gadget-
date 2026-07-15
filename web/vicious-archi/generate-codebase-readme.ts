'use server';
/**
 * @fileoverview Genkit flow for generating a context-aware README for a dissected codebase.
 *
 * Exports:
 *  - generateCodebaseReadme(input) → { readmeContent: string }
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateCodebaseReadmeInputSchema = z.object({
  codebaseDescription: z
    .string()
    .describe(
      'A structured description of the codebase: file paths, detected framework, dependencies, and representative code snippets.'
    ),
});
export type GenerateCodebaseReadmeInput = z.infer<typeof GenerateCodebaseReadmeInputSchema>;

const GenerateCodebaseReadmeOutputSchema = z.object({
  readmeContent: z
    .string()
    .describe('The generated README.md content in Markdown format.'),
});
export type GenerateCodebaseReadmeOutput = z.infer<typeof GenerateCodebaseReadmeOutputSchema>;

const generateReadmePrompt = ai.definePrompt({
  name: 'generateCodebaseReadmePrompt',
  input: { schema: GenerateCodebaseReadmeInputSchema },
  output: { schema: GenerateCodebaseReadmeOutputSchema },
  prompt: `You are an expert software engineer and technical writer.
Generate a comprehensive, developer-friendly README.md for the codebase described below.

The README must include:
1. A clear project title and one-sentence description
2. Key features (bullet list)
3. Tech stack / dependencies
4. Getting started: prerequisites, install, env setup, run instructions
5. Project structure overview
6. How to use / contribute (if relevant)

Use clean Markdown. Be concise but complete. Do not invent features not evidenced in the code.

Codebase description:
{{{codebaseDescription}}}`,
});

const generateCodebaseReadmeFlow = ai.defineFlow(
  {
    name: 'generateCodebaseReadmeFlow',
    inputSchema: GenerateCodebaseReadmeInputSchema,
    outputSchema: GenerateCodebaseReadmeOutputSchema,
  },
  async (input) => {
    const { output } = await generateReadmePrompt(input);
    if (!output) {
      throw new Error('Gemini returned no output for README generation.');
    }
    return output;
  }
);

export async function generateCodebaseReadme(
  input: GenerateCodebaseReadmeInput
): Promise<GenerateCodebaseReadmeOutput> {
  return generateCodebaseReadmeFlow(input);
}
