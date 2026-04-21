# AgentQuest Website

This repo contains the website/frontend for AgentQuest.

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

Environment:

- `VITE_WORLD_API_BASE_URL` (default `http://localhost:8787`)

## Responsibility boundary

- Website: UI and public-facing pages
- World service: authoritative simulation + API
- Agent client: autonomous decision-making + LLM