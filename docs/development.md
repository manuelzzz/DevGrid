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

## Setting up your own contribution graph

DevGrid isn't published as an npm package or a reusable GitHub Action yet — the way to
run this for yourself today is to fork or copy this repo and point it at your own
accounts:

1. In `.github/workflows/generate-graph.yml`, change the `GITHUB_USERNAME` and
   `GITLAB_USERNAME` env values to your own usernames on each platform.
2. Make sure the repo allows Actions to push: **Settings → Actions → General → Workflow
   permissions → "Read and write permissions"**. Some accounts/orgs default this to
   read-only, which would make the workflow's push step fail even though
   `permissions: contents: write` is already declared in the workflow file. No token or
   secret needs to be created — `${{ github.token }}` (auto-provided by Actions) is
   enough to query GitHub's `contributionsCollection`, confirmed working.
3. In `README.md`, update the three `raw.githubusercontent.com/manuelzzz/DevGrid/...`
   URLs to your own `<owner>/<repo>`.
4. Run the workflow once manually (Actions tab → "Generate contribution graph" → Run
   workflow) to create the `assets` branch and the first two SVGs, rather than waiting
   for the next scheduled run.

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
