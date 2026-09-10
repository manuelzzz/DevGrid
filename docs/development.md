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
npm run generate-graph -- contributions.svg
```

## Contribution graph

`.github/workflows/generate-graph.yml` runs `generate-graph` daily and pushes the
resulting `contributions.svg` to a dedicated `assets` branch (kept separate from `main` so
scheduled runs don't add noise to its history). The README embeds that file directly from
`raw.githubusercontent.com`, which serves files straight out of a public repo with no
auth — the same mechanism most "profile README" widgets use, since a README itself can't
run any code (no `fetch`, no scripts), only reference static image URLs.

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
