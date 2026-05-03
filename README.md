# manus-llm

OpenRouter LLM gateway for Manus — ChatGPT, Claude, and Gemini via one unified API.

> **Security note:** This server is intended to run **server-side only**. Never expose your `OPENROUTER_API_KEY` to the browser or commit it to git.

---

## Models

| Key | Model ID | Best for | Est. cost |
|---|---|---|---|
| `chatgpt` | `openai/gpt-5.5` | Tool use, structured output | $5/M in · $30/M out |
| `claude` | `anthropic/claude-sonnet-4.6` | Agents, planning, professional work | $3/M in · $15/M out |
| `gemini` | `google/gemini-2.5-pro` | Code, reasoning (via your BYOK key) | $1.25/M in · $10/M out |

**Task auto-routing:**
- `taskType: "code"` → Gemini 2.5 Pro
- `taskType: "planning"` → Claude Sonnet
- `taskType: "structured"` → GPT-5.5
- _(default)_ → Claude Sonnet

---

## Setup

### 1. Clone
```bash
git clone https://github.com/cookiemenace/manus-llm.git
cd manus-llm
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
cp .env.example .env
```

Open `.env` and fill in your values:
```env
# Required — get from https://openrouter.ai/settings/keys
OPENROUTER_API_KEY=sk-or-v1-your-key-here

# Your app info (shows in OpenRouter dashboard)
APP_URL=https://yourapp.com
APP_NAME=Manus

# Server port
PORT=3000
```

> **Important:** `.env` is already in `.gitignore`. Never commit your real API key.

### 4. Start the server
```bash
# Development (auto-restarts on changes)
npm run dev

# Production
npm start
```

Server runs on `http://localhost:3000`

---

## API Reference

### GET `/`
Health check. Returns available models.

```json
{
  "status": "ok",
  "models": {
    "chatgpt": "openai/gpt-5.5",
    "claude": "anthropic/claude-sonnet-4.6",
    "gemini": "google/gemini-2.5-pro"
  }
}
```

---

### POST `/api/llm`

Call any model by name or task type.

**Headers:**
```
Content-Type: application/json
```

**Body options:**

| Field | Type | Required | Description |
|---|---|---|---|
| `messages` | array | Yes | OpenAI-format message array |
| `model` | string | No | `chatgpt`, `claude`, or `gemini` (default: `claude`) |
| `taskType` | string | No | `code`, `planning`, or `structured` (auto-routes) |
| `temperature` | number | No | 0–1 (default: `0.2`) |

**Example — by model name:**
```bash
curl -X POST http://localhost:3000/api/llm \
  -H "Content-Type: application/json" \
  -d '{
    "model": "claude",
    "messages": [{ "role": "user", "content": "Hello!" }]
  }'
```

**Example — by task type (auto-routing):**
```bash
curl -X POST http://localhost:3000/api/llm \
  -H "Content-Type: application/json" \
  -d '{
    "taskType": "code",
    "messages": [{ "role": "user", "content": "Write a quicksort in JavaScript" }]
  }'
```

**Response:**
```json
{
  "content": "Here is a quicksort...",
  "model": "google/gemini-2.5-pro",
  "usage": {
    "prompt_tokens": 18,
    "completion_tokens": 120,
    "total_tokens": 138
  }
}
```

---

## Production Checklist

- [ ] Set `OPENROUTER_API_KEY` in your server environment (not in code)
- [ ] Add authentication/middleware before `/api/llm` so only your app can call it
- [ ] Add rate limiting (e.g. `express-rate-limit`) to prevent abuse
- [ ] Set `APP_URL` to your real domain so OpenRouter dashboard shows correct attribution
- [ ] Monitor usage at https://openrouter.ai/activity
- [ ] Gemini routes via your BYOK Google Enterprise key — verify it’s active at https://openrouter.ai/settings/byok

---

## Notes

- Built with Node.js ESM (`"type": "module"`)
- Uses OpenRouter’s OpenAI-compatible chat completions endpoint
- Gemini calls are routed through your Google Enterprise BYOK key automatically
- Add more models anytime by updating the `MODELS` object in `lib/llm.js`
