# DogFinder

DogFinder is a Tinder-style React SPA for discovering dog breeds. Swipe left to reject, right to like, and up to super like. The app persists your feed progress and keeps a local interaction history with dedicated History and Favorites pages.

## Tech Stack

- React 19 + TypeScript + Vite
- React Router
- Tailwind CSS v4 (semantic theme tokens)
- TanStack Query (server state)
- Zustand (client state)
- Vitest + React Testing Library

## Setup (pnpm)

1. Install dependencies:

```bash
pnpm install
```

2. Configure environment variables:

```bash
cp .env.example .env
```

Required env values:

```env
VITE_APP_NAME=DogFinder
VITE_DOG_API_BASE_URL=https://api.thedogapi.com/v1
VITE_DOG_API_KEY=your_dog_api_key
VITE_PROGRESS_STORAGE_KEY=dogfinder.progress.v1
```

3. Start development server:

```bash
pnpm dev
```

## Scripts

- `pnpm dev`: start Vite dev server
- `pnpm build`: build production bundle
- `pnpm lint`: run ESLint
- `pnpm check:types`: run TypeScript checks
- `pnpm test`: run Vitest with coverage

## Application Structure

- `src/routes/index.tsx`: central route definitions (`/`, `/dogs/:dogId`, `/history`, `/favorites`)
- `src/routes/loaders/dog-details.loader.ts`: route param safety middleware for `dogId`
- `src/services/http.api.ts`: shared Axios instance with `x-api-key`
- `src/services/dog.api.ts`: Dog API service calls
- `src/hooks/useQueryCustom.ts` and `src/hooks/useMutationCustom.ts`: shared TanStack Query wrappers
- `src/stores/useSwipeStore.ts`: swipe progress persistence
- `src/stores/useHistoryStore.ts`: local history persistence and filtering
- `src/components`: Atomic Design structure (atoms, molecules, organisms, templates)

## Key Technical Decisions

- Uses one active API key (`VITE_DOG_API_KEY`), no profile switching UI.
- No auth-protected routes; route-level loader validates invalid detail URL params.
- Progress persists to localStorage using `VITE_PROGRESS_STORAGE_KEY`.
- History persistence key is derived from progress key and stored locally.
- Favorites page includes both likes and super likes.
- Main card behavior follows Tinder-style directional swipe thresholds with smooth card transitions.

## Quality and Git Hooks

- Husky `pre-commit` runs:

```bash
pnpm lint && pnpm check:types && pnpm test
```

- Conventional commit messages are enforced by `commit-msg` hook via commitlint.

## Testing Coverage Focus

- Environment validation (`parseEnv`)
- Server hook success/error states (`useDogBreedsQuery`)
- Store persistence behavior (`useSwipeStore`, `useHistoryStore`)
- Home swipe button parity and vote flow
- Details required fields rendering
- History filtering behavior
- Favorites includes only like/super like entries

## API Reference

- The Dog API: [https://api.thedogapi.com/v1](https://api.thedogapi.com/v1)
- Docs: [https://docs.thedogapi.com](https://docs.thedogapi.com)
