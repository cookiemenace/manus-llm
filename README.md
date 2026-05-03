# manus-llm

OpenRouter LLM gateway for Manus — ChatGPT, Claude, and Gemini via one unified API.

## Models

| Key | Model | Best for |
|---|---|---|
| `chatgpt` | `openai/gpt-5.5` | Tool use, structured output |
| `claude` | `anthropic/claude-sonnet-4.6` | Agents, planning, professional work |
| `gemini` | `google/gemini-2.5-pro` | Code, reasoning (routes via your BYOK key) |

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
Edit `.env` and add your OpenRouter API key:
```
OPENROUTER_API_KEY=sk-or-v1-your-key-here
```

### 4. Start the server
```bash
npm run dev
```
Server runs on `http://localhost:3000`

## API

### Health check
```
GET /
```
Returns active models.

### Call a model
```
POST /api/llm
Content-Type: application/json
```

**By model name:**
```json
{
  "model": "claude",
  "messages": [{ "role": "user", "content": "Hello!" }]
}
```

**By task type (auto-routing):**
```json
{
  "taskType": "code",
  "messages": [{ "role": "user", "content": "Write a sort function" }]
}
```

Task types: `code` → Gemini, `planning` → Claude, `structured` → ChatGPT

**Response:**
```json
{
  "content": "...",
  "model": "google/gemini-2.5-pro",
  "usage": { "prompt_tokens": 10, "completion_tokens": 42 }
}
```

## Notes
- Gemini routes via your BYOK Google Enterprise key configured in OpenRouter
- Keep `.env` out of git (already in `.gitignore`)
- OpenRouter dashboard: https://openrouter.ai/activity
