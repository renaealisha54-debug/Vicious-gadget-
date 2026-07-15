// Groq API helper (OpenAI-compatible)
const GROQ_API_KEY = process.env.GROQ_API_KEY!;
const GROQ_MODEL = 'llama-3.3-70b-versatile';

export async function groqChat(
  systemPrompt: string,
  userMessage: string,
): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: 0.2,
      max_tokens: 2048,
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Groq error ${res.status}: ${err}`);
  }
  const data = await res.json();
  return data.choices[0].message.content as string;
}

// JSON-mode helper — strips fences and parses
export async function groqJSON<T>(
  systemPrompt: string,
  userMessage: string,
): Promise<T> {
  const raw = await groqChat(systemPrompt + '\n\nRespond ONLY with valid JSON. No markdown fences, no preamble.', userMessage);
  const cleaned = raw.replace(/```json|```/g, '').trim();
  return JSON.parse(cleaned) as T;
}
