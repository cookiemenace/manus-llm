import 'dotenv/config';
import fetch from 'node-fetch';

// ── Model registry ──────────────────────────────────────────────
const MODELS = {
  chatgpt: 'openai/gpt-5.5',
  claude:  'anthropic/claude-sonnet-4.6',
  gemini:  'google/gemini-2.5-pro',
};

// ── Smart routing by task type ───────────────────────────────────
export function chooseModel(taskType = 'default') {
  switch (taskType) {
    case 'code':       return MODELS.gemini;   // Gemini 2.5 Pro — best for code
    case 'planning':   return MODELS.claude;   // Claude Sonnet — agents + planning
    case 'structured': return MODELS.chatgpt;  // GPT-5.5 — tool use + structured output
    default:           return MODELS.claude;   // Claude as sensible default
  }
}

// ── Core LLM call ───────────────────────────────────────────────
export async function callLLM({
  model = 'claude',
  messages,
  temperature = 0.2,
  taskType,
}) {
  // Allow taskType shorthand OR explicit model key
  const modelId = taskType
    ? chooseModel(taskType)
    : (MODELS[model] ?? model);

  const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': process.env.APP_URL ?? 'http://localhost:3000',
      'X-Title': process.env.APP_NAME ?? 'Manus',
    },
    body: JSON.stringify({ model: modelId, messages, temperature }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`OpenRouter error ${res.status}: ${err}`);
  }

  const data = await res.json();
  return {
    content: data.choices[0].message.content,
    model: data.model,
    usage: data.usage,
  };
}

export { MODELS };
