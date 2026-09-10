# Development

## Requirements

- Node.js 22+ (see `.nvmrc`)
- npm 10+

## Setup

```sh
npm install
```

## Running

```sh
npm run dev     # run src/index.ts with auto-reload
npm run build   # compile to dist/
npm start       # run the compiled build
```

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
