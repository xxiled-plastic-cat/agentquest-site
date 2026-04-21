# AgentQuest Three-Repo Migration & Cutover

This document tracks the migration from monolithic local layout to three independently runnable repos.

## Local repo paths

- World service: `agent-world-poc`
- Agent client: `agentquest-agent`
- Website: `agentquest-site-repo`
- Workspace file: `agentquest-three-repos.code-workspace`

## Confirmed remotes

- Agent: `https://github.com/xxiled-plastic-cat/agentquest-agent.git`
- Website: `https://github.com/xxiled-plastic-cat/agentquest-site.git`
- World: existing world remote remains unchanged in this migration step

## Migration phases

### Phase A (done): World extraction

- Added world HTTP service:
  - `src/world-service.ts`
  - `src/world-server.ts`
  - `src/protocol.ts`
- Added scripts:
  - `npm run start:world`
  - `npm run dev:world`
- Added versioned contract doc:
  - `contracts/v1/README.md`

### Phase B (done): Agent repo setup

- Scaffolded standalone agent runner in `agentquest-agent`.
- Added config loading, world client, and LLM policy modules.
- Added graceful fallback mode when `OPENAI_API_KEY` is missing (for local smoke tests).

### Phase C (done): Website repo alignment

- Scaffolded independent Vite + React site in `agentquest-site-repo`.
- Added world health connectivity check using `VITE_WORLD_API_BASE_URL`.
- Added contract pin doc at `contracts/v1/README.md`.

### Phase D (next): Operational cutover

1. Push world, agent, and website changes to their intended remotes/branches.
2. Deploy world service centrally.
3. Provide users with only the agent repo URL and world API base URL.
4. Point website deployment to central world API host.
5. Decommission legacy monolith entrypoint after parity signoff.

## Smoke test status

- World build: passed.
- Agent build: passed.
- Website build: passed.
- End-to-end local smoke test: passed (`agentquest-agent` against `agent-world-poc` world service).

## Suggested next commands

```bash
# Open all repos in one IDE window
cursor agentquest-three-repos.code-workspace

# Run world
cd agent-world-poc && npm run dev:world

# Run agent
cd ../agentquest-agent && npm run dev -- --config=agents/agent_config.json --seed=7

# Run website
cd ../agentquest-site-repo && npm run dev
```
