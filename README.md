# DogFinder

DogFinder is a React SPA for exploring dog breeds from The Dog API.  
Users can reject, like, or super-like breeds, open detailed breed information, and review interaction history.

## Project Goals

- Deliver a responsive swipe-based browsing experience on mobile and desktop.
- Keep UI interactions fast even when vote API responses are slow.
- Maintain clean architecture with predictable state boundaries.
- Enforce code quality through lint/type/test hooks.

## Tech Stack

- React 19 + TypeScript + Vite
- React Router
- Tailwind CSS v4
- TanStack Query
- Zustand
- Axios
- Vitest + React Testing Library
- ESLint + Husky + Commitlint + Knip

## Setup Instructions

### Prerequisites

- Node.js 20+ (recommended)
- pnpm 10+
- The Dog API key

### Install

```bash
pnpm install
```

### Environment

```bash
cp .env.example .env
```

Set values in `.env`:

```env
VITE_APP_NAME=DogFinder
VITE_DOG_API_BASE_URL=https://api.thedogapi.com/v1
VITE_DOG_API_KEY=your_dog_api_key
VITE_PROGRESS_STORAGE_KEY=dogfinder.progress.v1
```

### Run

```bash
pnpm dev
```

## Available Scripts

- `pnpm dev`: start Vite development server
- `pnpm build`: type-check build and create production bundle
- `pnpm lint`: run ESLint
- `pnpm check:types`: run TypeScript checks
- `pnpm test`: run Vitest with coverage
- `pnpm check:unused`: detect unused files/exports/dependencies with Knip

## Why These Libraries

- React + TypeScript:
  - Required by the assessment.
  - Type safety reduces runtime bugs in API payload handling and state transitions.
- Vite:
  - Faster startup and HMR than older webpack-style setups.
  - Minimal config for a small-to-medium SPA.
- React Router:
  - Lightweight nested routing with loaders for route-level guard/validation.
  - Simpler fit than a full framework router for this scope.
- TanStack Query:
  - Strong server-state primitives (loading/error/retry/caching) out of the box.
  - Preferred over manual fetch + custom caching due to lower maintenance risk.
- Zustand:
  - Small API for local client state (swipe index/history filter) without boilerplate.
  - More lightweight than Redux Toolkit for this project size.
- Axios:
  - Centralized HTTP client configuration (base URL, headers, timeout).
  - Better request config ergonomics than scattered `fetch` calls for this codebase.
- Tailwind CSS v4:
  - Utility-first styling keeps component-level styling close to markup.
  - Fast iteration and consistent semantic token usage.
- Vitest + RTL:
  - Fast TS-native unit tests with behavior-focused UI assertions.
  - Good Vite integration and low config overhead.
- Husky + Commitlint:
  - Prevent low-quality commits by enforcing lint/type/test and conventional commit format.
- Knip:
  - Continuous cleanup for unused exports/dependencies to avoid codebase drift.

## Technical Decisions

- Single API key model:
  - No auth flow in scope; one configured API key is enough for assessment requirements.
- API layer separation:
  - `src/services/http.api.ts` holds shared axios instance.
  - `src/services/dog.api.ts` defines Dog API calls.
  - Components never call axios directly.
- Server/client state split:
  - TanStack Query handles remote breed/vote operations.
  - TanStack Query also handles remote favourites (`GET /v1/favourites`).
  - Zustand handles local swipe position and history filter.
- Swipe progress persistence:
  - Progress is persisted in `localStorage` using `VITE_PROGRESS_STORAGE_KEY`.
  - App resumes from stored position on reload.
- History persistence:
  - Interaction history is stored locally under a key derived from progress storage key.
- Favorites page data source:
  - Favorites are loaded from Dog API favourites endpoint, then mapped to UI rows.
  - Breed names are resolved from API image breeds or fallback-matched against `/breeds`.
- Non-blocking voting UX:
  - Vote request runs in background after interaction is recorded locally.
  - Mutation retries are enabled (`retry: 2` with backoff) to reduce transient failures.
- Route safety:
  - `dogs/:dogId` uses loader validation to prevent invalid IDs.
- Component architecture:
  - Atomic structure (`atoms`, `molecules`, `organisms`, `templates`) to keep UI reusable.

## Project Structure

- `src/routes/index.tsx`: route definitions (`/`, `/dogs/:dogId`, `/history`, `/favorites`)
- `src/routes/loaders/dog-details.loader.ts`: `dogId` validation
- `src/services/http.api.ts`: shared axios client
- `src/services/dog.api.ts`: Dog API request functions
- `src/hooks`: query/mutation hooks
- `src/stores`: Zustand stores for local state
- `src/components`: UI layers (atomic design)
- `src/pages`: route-level page components

## Quality and Testing

- Husky `pre-commit` hook:

```bash
pnpm lint && pnpm check:types && pnpm test
```

- Conventional commits enforced in `commit-msg` hook.
- Unit tests cover:
  - env validation
  - query error/success state
  - swipe/history stores
  - home vote interaction
  - details required fields
  - history filtering
  - favorites API rendering

## API Reference

- The Dog API: [https://api.thedogapi.com/v1](https://api.thedogapi.com/v1)
- Documentation: [https://docs.thedogapi.com](https://docs.thedogapi.com)
