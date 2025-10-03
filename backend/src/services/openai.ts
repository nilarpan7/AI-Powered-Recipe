import OpenAI from 'openai';

const openAiApiKey = process.env.OPENAI_API_KEY;
if (!openAiApiKey) {
  // Fail fast with a clear message in logs, but allow server to boot
  console.warn('[OpenAI] Missing OPENAI_API_KEY. /api/generate will return 503 until it is set.');
}

export const openai = openAiApiKey ? new OpenAI({ apiKey: openAiApiKey }) : null as unknown as OpenAI;

const SYSTEM_PROMPT = `You are a helpful nutrition-aware recipe assistant. Generate safe, simple, healthy recipes. Avoid allergens and reflect user preferences.
- Output ONLY valid JSON that matches the provided schema.
- Recipes must be ready in under 45 minutes and serve 4–6.
- Avoid listed allergens strictly.
- Provide 5–8 steps and a basic nutrition summary (estimated).`;

export async function generateRecipeJson(profile: unknown, input: { goal?: string; available_time?: number; meal_type?: string }) {
  if (!openAiApiKey || !openai) {
    const err: any = new Error('OpenAI is not configured');
    err.statusCode = 503;
    err.expose = true;
    throw err;
  }
  const schema = {
    title: 'string',
    overview: 'string',
    meal_type: '"breakfast"|"lunch"|"dinner"|"snack"',
    ingredients: '[{ name: string, quantity: number|string, unit: string }]',
    steps: '[string]',
    nutrition: '{ calories: number, protein: number, carbs: number, fat: number }'
  };

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'user',
      content: [
        'JSON schema (must match):',
        JSON.stringify(schema),
        '\nUser profile:',
        JSON.stringify(profile ?? {}),
        '\nUser input:',
        JSON.stringify(input ?? {}),
        '\nReturn ONLY JSON with no markdown, no backticks, no comments.'
      ].join('\n')
    }
  ];

  const resp = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    temperature: 0.7
  });

  const content = resp.choices?.[0]?.message?.content?.trim() ?? '{}';
  let parsed: any;
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    throw new Error('Failed to parse AI response as JSON');
  }
  return parsed;
}


