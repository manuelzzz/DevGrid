# Development

## Requirements

- Node.js 22+ (see `.nvmrc`)
- npm 10+

## Setup

```sh
npm install
```

## Environment variables

- `GITHUB_TOKEN` — a GitHub personal access token, required by
  `fetchGithubContributions` (GitHub's GraphQL API requires authentication even
  for public data). No scopes are needed. Export it in your shell before
  running anything that hits GitHub:

  ```sh
  export GITHUB_TOKEN=ghp_xxx
  ```

  GitLab's contribution data (`fetchGitlabContributions`) uses a public
  endpoint and needs no token.

## Running

```sh
npm run build                       # compile to dist/
npm run fetch -- gitlab <username>  # print a GitLab user's contribution days
npm run fetch -- github <username>  # print a GitHub user's contribution days (needs GITHUB_TOKEN)

# generate the unified graph (needs GITHUB_TOKEN, GITHUB_USERNAME, GITLAB_USERNAME)
# writes <prefix>-light.svg and <prefix>-dark.svg
npm run generate-graph -- contributions
```

## Contribution graph

`.github/workflows/generate-graph.yml` runs `generate-graph` daily and pushes the
resulting `contributions-light.svg` / `contributions-dark.svg` to a dedicated `assets`
branch (kept separate from `main` so scheduled runs don't add noise to its history). The
README embeds both via a `<picture>` element with `prefers-color-scheme` sources, so
GitHub shows whichever variant matches the viewer's theme — a README can't run any code
(no `fetch`, no scripts) to pick a theme at runtime, only reference static image URLs, so
both variants have to be pre-rendered. Files are served from `raw.githubusercontent.com`,
which serves straight out of a public repo with no auth needed.

## Testing

```sh
npm test          # run tests once
npm run test:watch # run tests in watch mode
```

## Linting & formatting

```sh
npm run lint         # check for lint errors
npm run lint:fix     # fix lint errors automatically
npm run format       # format files with Prettier
npm run format:check # check formatting without writing
npm run typecheck    # check TypeScript types without emitting
```

CI runs `format:check`, `lint`, `typecheck`, and `test` on every push and pull request. Run these locally before pushing.
