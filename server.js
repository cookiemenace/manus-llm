import 'dotenv/config';
import express from 'express';
import { callLLM, MODELS } from './lib/llm.js';

const app = express();
app.use(express.json());

// ── Health check ────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'ok', models: MODELS });
});

// ── Main LLM endpoint ──────────────────────────────────────────
// POST /api/llm
// Body: { model, messages, temperature?, taskType? }
app.post('/api/llm', async (req, res) => {
  const { model, messages, temperature, taskType } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  try {
    const result = await callLLM({ model, messages, temperature, taskType });
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ── Start ─────────────────────────────────────────────────────
const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
  console.log(`Manus LLM server running on http://localhost:${PORT}`);
  console.log('Models loaded:', MODELS);
});
