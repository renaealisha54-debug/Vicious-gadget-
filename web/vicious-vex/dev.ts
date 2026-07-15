import { config } from 'dotenv';
config();

import '@/ai/flows/ai-code-snippet-generation.ts';
import '@/ai/flows/ai-error-explanation-and-fix.ts';
import '@/ai/flows/ai-code-completion.ts';