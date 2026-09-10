# Agent & contributor guidelines

Practical rules for working on DevGrid. Read this before making changes.

## Principles

- Keep it simple. Prefer a concrete implementation over a generic one.
- Don't build abstractions (providers, strategies, repositories, plugins, etc.)
  for cases that don't exist yet. Only introduce an abstraction when there are
  at least two real, current call sites that need it.
- Don't design for hypothetical future platforms. If today the code only
  needs to talk to GitHub, write code that talks to GitHub — not an
  "activity source" interface with one implementation.
- Keep changes small and focused. One PR should do one thing.
- If you're unsure whether something is premature, assume it is.

## Project structure

- `src/` — application source code (TypeScript).
- `docs/` — technical documentation that is actually needed to develop the
  project (setup, testing, how things run). Not a place for vision, roadmap,
  or specs.
- No `specs/`, `decisions/`, `domain/`, `protocols/`, or `architecture/`
  directories. If one of these becomes genuinely necessary, introduce it then,
  with a concrete reason, not in advance.

## Code style

- TypeScript, strict mode (`tsconfig.json`).
- Formatting is enforced by Prettier — run `npm run format` before
  committing, don't hand-format.
- Linting is enforced by ESLint (`eslint.config.js`) — fix warnings/errors
  rather than disabling rules, unless there's a specific reason worth a
  comment.
- Prefer plain functions and explicit code over classes, interfaces, and
  design patterns unless there's a concrete need for polymorphism.

## Testing

- Tests live next to the code they test, as `*.test.ts`.
- Use Vitest (`npm test` / `npm run test:watch`).
- New behavior should come with a test that would fail without it. Don't add
  tests for hypothetical future behavior.

## Dependencies

- Adding a dependency should solve a real, current problem. Prefer the
  Node.js standard library or a small amount of first-party code over a new
  dependency for something trivial.
- Keep `package.json` scripts as the single entry point for common tasks
  (build, dev, test, lint, format).

## External integrations (GitHub, GitLab, etc.)

- Implement integrations concretely, against the actual API being used.
  Don't build a generic "provider interface" until there are at least two
  real providers whose implementations reveal what the shared shape actually
  is.
- Keep integration code isolated in its own module so it _can_ be
  generalized later, but don't add abstraction layers speculatively.

## Adding new functionality

1. Prefer the smallest change that solves the concrete problem in front of
   you.
2. Add or update tests alongside the change.
3. Run `npm run lint`, `npm run typecheck`, `npm test`, and `npm run
format:check` before opening a PR — CI runs the same checks.
4. Keep the PR description focused on what and why.

## Documentation

- Only document what's needed to develop and run the project right now
  (see `docs/development.md`).
- Do not write vision, roadmap, requirements, or architecture documents
  speculatively. Add documentation when there's real content to describe.
