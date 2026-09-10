# CLAUDE.md

Repository-specific guidance for Claude Code. General contributor rules
(structure, style, testing, dependencies, principles) live in
[AGENTS.md](AGENTS.md) — read that first; this file only adds what's
specific to working here as an agent.

## Current state

DevGrid is freshly scaffolded. There is no product functionality yet —
`src/index.ts` is a placeholder. Don't treat its presence as a hint to build
around it; wait for a concrete task.

## Before making a change

- Re-read `AGENTS.md` for the project's stance on abstractions: don't
  introduce provider interfaces, strategy patterns, or generic
  "activity source" concepts speculatively. If asked to add GitHub support,
  write GitHub-specific code, not a generic integration framework.
- Don't create `specs/`, `decisions/`, `domain/`, `protocols/`, or
  `architecture/` directories or documents. Don't expand `docs/` with
  vision/roadmap/requirements content.

## Verifying work

Before considering a task done, run and report the actual results of:

```sh
npm run format:check
npm run lint
npm run typecheck
npm test
```

These are the same checks CI runs (`.github/workflows/ci.yml`). Don't claim
something passes without having run it in this session.

## Scope discipline

- Keep changes small and focused on the task given. Don't take the
  opportunity to also generalize, refactor speculatively, or add unrelated
  documentation.
- If a task seems to call for a bigger abstraction or a new top-level
  directory, pause and ask rather than introducing it unilaterally.
