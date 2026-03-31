# DogFinder

DogFinder is a React SPA for exploring dog breeds from The Dog API.  
Users can reject, like, or super-like breeds, open detailed breed information, and review interaction history.

## Project goals

- Deliver a responsive swipe-based browsing experience on mobile and desktop.
- Keep UI interactions fast even when vote API responses are slow.
- Keep a clear split between **server state** (API) and **client state** (UI + local persistence).
- Enforce quality with lint, types, unit tests (high coverage), and optional E2E checks.

## Tech stack (summary)

| Area | Choice |
|------|--------|
| UI | React 19, TypeScript |
| Build | Vite 8 |
| Routing | React Router 7 |
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Server state | TanStack Query |
| Client state | Zustand |
| HTTP | Axios (single shared instance) |
| Env validation | Zod |
| Unit tests | Vitest, jsdom, React Testing Library |
| E2E | Playwright |
| Git hooks | Husky, Commitlint; unused-code scan with Knip |

---

## Setup instructions

### Prerequisites

- **Node.js** 20 or newer (matches modern Vite/TypeScript expectations).
- **pnpm** 10+ ([install pnpm](https://pnpm.io/installation)). This repo standardizes on `pnpm` for lockfile consistency and script usage.
- A **Dog API** key from [The Dog API](https://thedogapi.com/) (free tier is enough for development).

### 1. Install dependencies

```bash
pnpm install
```

This runs the `prepare` script (Husky) so Git hooks are installed locally.

### 2. Environment variables

Copy the example file and fill in your API key:

```bash
cp .env.example .env
```

Edit `.env`:

| Variable | Purpose |
|----------|---------|
| `VITE_APP_NAME` | Display name for the app (used where the name is surfaced). |
| `VITE_DOG_API_BASE_URL` | Base URL for The Dog API (default in `.env.example` is correct for production API). |
| `VITE_DOG_API_KEY` | Your API key (required; empty key will fail validation at startup). |
| `VITE_PROGRESS_STORAGE_KEY` | Namespace for `localStorage` keys (swipe progress and derived history key). |

`src/Env.ts` parses and validates these values with **Zod** when the app loads. Invalid or missing values throw immediately instead of failing deep inside a request.

### 3. Development server

```bash
pnpm dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

### 4. Production build (local sanity check)

```bash
pnpm build
```

Runs the TypeScript project build, then Vite production bundling. Output is under `dist/`.

### 5. End-to-end tests (optional)

Playwright is configured to start the dev server on **127.0.0.1:4173** automatically. Install Chromium once, then run tests:

```bash
pnpm run test:e2e:install
pnpm run test:e2e
```

Other useful scripts: `test:e2e:headed`, `test:e2e:ui`, `test:e2e:debug`, `test:e2e:report`.

---

## Available scripts

| Script | Description |
|--------|-------------|
| `pnpm dev` | Vite dev server |
| `pnpm build` | Type-check + production bundle |
| `pnpm lint` / `pnpm lint:fix` | ESLint |
| `pnpm check:types` | TypeScript (`tsconfig.app.json`, no emit) |
| `pnpm check:unused` | Knip (unused files/exports/deps) |
| `pnpm test` | Vitest run with coverage |
| `pnpm test:watch` | Vitest watch mode |
| `pnpm test:e2e` | Playwright (see above) |
| `pnpm commitlint` | Commitlint CLI (the `commit-msg` hook runs it on each new commit) |

---

## Why these libraries (and not others)

### React + TypeScript

Strong typing for API shapes, route params, and store state reduces whole classes of runtime bugs. The project targets **React 19** for current APIs and ecosystem alignment.

### Vite (instead of Create React App / webpack-only setups)

Fast cold start and HMR, native ESM, and minimal configuration for an SPA. TypeScript checking is kept explicit (`tsc`) in `build` and `check:types` rather than relying on transpile-only behavior for correctness.

### React Router (instead of Next.js / Remix for this repo)

The product is a **client-rendered SPA** with no server components requirement. React Router provides declarative routes, nested layouts, and **loaders** for lightweight validation (e.g. `dogs/:dogId`) without adopting a full meta-framework.

### TanStack Query (instead of manual `fetch` + `useEffect`, or SWR alone)

Centralized **server state**: caching, deduplication, loading/error states, and mutations with retries. Vote mutations use explicit `retry` + backoff (`useVoteDogMutation`) so transient network issues are less visible to users while the UI stays optimistic/local-first where designed.

### Zustand (instead of Redux Toolkit / Context for global UI)

Swipe index, progress-save signals, and history list live in the browser and are not “server truth.” Zustand keeps that state **small, colocated, and persistent-friendly** without the boilerplate of a large global store.

### Axios (instead of raw `fetch` everywhere)

One shared instance (`src/services/http.api.ts`) sets **base URL, timeout, and `x-api-key` header** once. Feature modules call functions in `src/services/*.ts` instead of duplicating configuration.

### Tailwind CSS v4 + `@tailwindcss/vite`

Utility-first styling with **CSS-first configuration** in v4 and first-class Vite integration. Semantic tokens (e.g. `bg-primary`) keep theming consistent; `eslint-plugin-tailwindcss` helps class ordering and validity.

### clsx + tailwind-merge

The `cn()` helper merges conditional class names and resolves conflicting Tailwind utilities predictably—important when props toggle styles on shared components.

### lucide-react

Tree-shakeable icon set with consistent stroke and sizing instead of ad hoc inline SVGs scattered across the app.

### Zod

**Runtime** validation for `import.meta.env` in `Env.ts`. TypeScript alone does not validate values at runtime; Zod fails fast with clear errors if `.env` is misconfigured.

### Vitest + React Testing Library

Same toolchain as Vite (fast, ESM-friendly). Tests focus on **behavior** (user-visible outcomes) rather than implementation details. Coverage is collected with `@vitest/coverage-v8`.

### Playwright

E2E runs against real Chromium (desktop and mobile project configs) to catch integration issues between routing, storage, and UI that unit tests may miss.

### Husky + Commitlint + Knip

- **Husky**: run lint, types, and unit tests before commit (see hook config in repo).
- **Commitlint**: enforce [Conventional Commits](https://www.conventionalcommits.org/) for readable history and tooling.
- **Knip**: surface unused exports and dependencies before they accumulate.

---

## Technical decisions

### Environment and configuration

- **No `process.env` in app code**: Vite exposes `import.meta.env`; validation is centralized in `src/Env.ts`.
- **Single API key**: No end-user auth in scope; the Dog API key is injected at build/dev time.

### API and data flow

- **Layering**: `http.api.ts` → `dog.api.ts` (and similar) → **hooks** in `src/hooks` → **pages/components**. Components do not import Axios directly.
- **Pagination for favourites**: Total count and page metadata come from **response headers** (`pagination-count`, etc.), not the JSON body—see `getDogFavourites` in `dog.api.ts`.

### State boundaries

- **TanStack Query**: breeds list, favourites pages, mutations (votes, create favourite).
- **Zustand**: swipe position, swipe feedback signals, interaction history + filter (persisted locally).

### Local persistence

- **Swipe progress**: `localStorage` key from `VITE_PROGRESS_STORAGE_KEY`.
- **History**: key is derived in `src/config/storage.ts` as `${VITE_PROGRESS_STORAGE_KEY}.history` so it stays namespaced with progress.

### UX / resilience

- **Non-blocking votes**: Interactions can be recorded locally and mutations can complete in the background; retries reduce flake from short outages.
- **Favorites page**: Rows are built from the **favourites API**, with breed display names resolved from embedded image breed data or by matching against the breeds list (see `FavoritesPage` helpers).

### Routing and safety

- Invalid or missing `dogId` in `/dogs/:dogId` is handled in the **loader** (`dog-details.loader.ts`) with a redirect to `/`.

### UI architecture

- **Atomic-style folders** under `src/components` (`atoms`, `molecules`, `organisms`, `templates`) to encourage reuse and consistent composition.
- **Path alias `@/`** maps to `src/` in both Vite and TypeScript for stable imports.

### Testing expectations

- **Unit/integration**: `src/**/*.test.ts(x)` and `src/integration/`; Vitest excludes `e2e/**`.
- **Coverage**: Project convention targets high coverage on business logic and hooks (see `AGENTS.md` in the repo for contributor rules).

### Contributor / agent conventions

Day-to-day coding standards (React patterns, Tailwind semantics, query keys, commits) are documented in **`AGENTS.md`**. Treat it as the source of truth for implementation style when contributing.

---

## Project structure (high level)

| Path | Role |
|------|------|
| `src/routes/index.tsx` | Router definition (`/`, `/dogs/:dogId`, `/history`, `/favorites`) |
| `src/routes/loaders/` | Route loaders (e.g. dog id validation) |
| `src/services/http.api.ts` | Shared Axios client |
| `src/services/dog.api.ts` | Dog API functions |
| `src/hooks/` | TanStack Query hooks wrapping services |
| `src/stores/` | Zustand stores |
| `src/components/` | UI by atomic layer |
| `src/pages/` | Route-level pages |
| `src/Env.ts` | Validated environment |
| `e2e/` | Playwright specs |

---

## API reference (external)

- The Dog API base: [https://api.thedogapi.com/v1](https://api.thedogapi.com/v1)
- Documentation: [https://docs.thedogapi.com](https://docs.thedogapi.com)

---

## Quality gates

Pre-commit (Husky) typically runs:

```bash
pnpm lint && pnpm check:types && pnpm test
```

Commit messages are checked with Commitlint on `commit-msg`.
