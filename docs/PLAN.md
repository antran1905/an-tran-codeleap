# init and setup project

## Summary
- Build DogFinder as a React SPA with swipe behavior for dog breeds.
- Use `pnpm` for install/run scripts.
- Use environment validation in `@/Env.ts`.
- Use single active API key via `VITE_DOG_API_KEY`.

## Environment Variables
- `VITE_APP_NAME=DogFinder`
- `VITE_DOG_API_BASE_URL=https://api.thedogapi.com/v1`
- `VITE_DOG_API_KEY=`
- `VITE_PROGRESS_STORAGE_KEY=dogfinder.progress.v1`

## Routing and Middleware
- `/` Home
- `/dogs/:dogId` Details
- `/history` History
- `/favorites` Favorites
- Loader middleware validates `dogId` and redirects invalid URLs to `/`.

## Architecture
- Atomic Design layers in `src/components`:
  - Atoms: `IconButton`, `VoteChip`, `StatRow`, `PageHeading`, `LoadingState`, `ErrorState`
  - Molecules: `SwipeActionBar`, `BreedMetaPanel`, `HistoryFilterTabs`, `TopNav`
  - Organisms: `DogCardStack`, `DogDetailsPanel`, `InteractionHistoryList`
  - Templates: `CenteredAppShellTemplate`, `ListPageTemplate`
- API strategy:
  - Shared axios instance in `@/services/http.api.ts`
  - Dog API functions in `@/services/dog.api.ts`
  - Data access through `useQueryCustom` and `useMutationCustom`
  - Query keys in `@/common/queryKeys.ts`

## Core Behavior
- Home uses centered Tinder-style card stack.
- Card image backgrounds use cover + center to avoid stretching.
- Swipes: left `-1`, right `1`, up `2`.
- Buttons mirror swipe actions.
- Clicking card opens details.
- Swipe progress persists and resumes on reload.
- History page supports filtering.
- Favorites page shows likes + super likes.
- Home action bar uses only three actions: Dislike, Love, Star.

## Testing and Quality
- Unit/integration tests with Vitest + RTL for env, hooks, stores, pages, and filtering.
- Husky pre-commit: `pnpm lint && pnpm check:types && pnpm test`.
- README documents setup, architecture, and technical decisions.
