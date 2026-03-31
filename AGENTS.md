# AGENTS - React SPA Architecture

## Tech Stack Overview
- **Core:** React (with React Compiler) + Vite + TypeScript.
- **Routing:** React Router.
- **Styling:** Tailwind CSS v4 + shadcn/ui.
- **State Management:** TanStack Query (Server) + Zustand (Client).
<!-- - **Forms:** React Hook Form + Zod. -->
- **Testing:** Vitest + React Testing Library

## Principles
- Clarity and consistency over cleverness. Minimal changes. Match existing patterns.
- TypeScript everywhere; no `any` unless isolated and strictly necessary.
- No unnecessary `try/catch`. Avoid casting; use TypeScript narrowing.
- Named exports only (no default exports, except for React Router lazy-loaded route components).
- Absolute imports via `@/` for all `src` directories.
- Follow existing ESLint setup; don't reformat unrelated code.
- Options object for functions with 3+ parameters or ambiguous boolean flags.
- Hypothesis-driven debugging: identify 1-3 causes, validate the most likely first.

## React & React Compiler
- No `useMemo` or `useCallback` (React Compiler handles optimization natively).
- Keep `useEffect` minimal. Use it ONLY for external system synchronization, never for calculating derived state.
- Single `props` parameter with inline type. Access properties strictly via `props.foo` (ABSOLUTELY NO destructuring).
- Use `React.ReactNode`, not `ReactNode`.
- Inline short event handlers; extract them to named functions only when logic is complex.

## Styling & UI (Tailwind v4 + shadcn/ui)
- the main color is #00F0FF and #000000 and #F535AA
- Strictly use Tailwind utility classes.
- For UI components, always prioritize generating or reusing `shadcn/ui` components located in `@/components/atoms`.
- Do not modify `shadcn/ui` primitive files unless fundamentally changing the design system.
- Use `cn()` utility (clsx + tailwind-merge) for conditional class names.
- Keep components responsive (mobile-first approach).
- Images must be displayed in the background without being stretched
- **Semantic Colors Only:** Strictly use `shadcn/ui` semantic color variables for all UI elements. Use `bg-primary`, `text-primary-foreground`, `bg-muted`, `border-border`, `bg-destructive`, etc.
- **No Hardcoded Colors:** ABSOLUTELY NO arbitrary hex codes (e.g., `bg-[#ff0000]`) or raw Tailwind palette colors (e.g., `bg-blue-500`, `text-red-500`) in component files.
- **Dark Mode Compatibility:** Always rely on CSS variables (which automatically adapt to light/dark themes) rather than explicitly declaring dark mode classes (e.g., prefer `bg-background` over `bg-white dark:bg-black`).
- **Global Theme Definition:** Any new core brand colors must be defined as CSS variables in the global stylesheet (`index.css` or `globals.css`) under the `:root` and `.dark` selectors, mapped to Tailwind v4 `@theme`.
- **Opacity Modifiers:** Use Tailwind's opacity modifiers with semantic colors if transparency is needed (e.g., `bg-primary/50`, `text-foreground/70`).


## Routing (React Router)
- Define all routes centrally in `@/routes/index.tsx`.
- Use React Router's `loader` and `action` functions for route-level data fetching and mutations where appropriate.
- Prefer `useNavigate` and `Link` for client-side transitions. Never use standard `<a>` tags for internal routing.

## State Management & Data Fetching
- **Server State:** Use TanStack Query. 
  - Create custom hooks in `@/hooks` (e.g., `useQueryCustom`, `useMutationCustom`).
  - Maintain all query keys in `@/common/queryKeys.ts`.
- **Global Client State:** Use Zustand. Store files in `@/stores` (e.g., `useSwipeStore.ts`).
- **Local State:** Use `useState` for simple, isolated UI state.

## Forms & Validation (Zod + React Hook Form)
- Zod type-only imports: `import type * as z from 'zod';`.
- Define Zod schemas explicitly for every form and API payload in `@/schemas`.
- Separate form submission logic from the UI rendering.

## Agentic Guardrails & Security
- **No Hallucinated Packages:** DO NOT use or import third-party npm packages unless they are already present in `package.json`.
- **UI Components:** Before building a custom UI element, check if a similar primitive exists in `@/components`.
- **Secrets:** Never log sensitive user data, tokens, or environment variables to the console.

## API Implementation
- Define request and response interfaces in `@/interfaces`.
- Use one shared Axios instance in `@/services/http.api.ts`. Do not create additional `axios.create(...)` instances in feature service files.
- Implement API request functions (axios/fetch wrappers) in `@/services` and consume the shared `httpApi` instance.
- Never call services directly inside components; always wrap them in custom React Query hooks.

## Git Commits & Commands
- Only use `bun run` scripts: `dev`, `build`, `lint`, `check:types`, `test`.
- Conventional Commits: `type: summary` without scope.
- Summary: Short, specific sentence explaining what changed and why.
- Types: `feat|fix|docs|style|refactor|perf|test|build|ci|chore|revert`.

## Token Efficiency
- Skip recaps and explanations unless the result is ambiguous or you need clarification before proceeding.

## Naming Conventions
- **Directories:** Always use `kebab-case` (e.g., `@/components/auth-form`, `@/common/query-keys`).
- **React Components:** Use `PascalCase` for both filename and component name (e.g., `UserCard.tsx`, `SignInButton.tsx`).
- **Hooks:** Use `camelCase` with `use` prefix (e.g., `useQueryCustom.ts`, `useSwipeMutation.ts`).
- **Utils/Logic:** Use `camelCase` (e.g., `authService.ts`, `dateTimeUtils.ts`).
- **Services:** Use `kebab-case` (e.g., `user.api.ts`).
- **Types/Interfaces/Enums:** Use `kebab-case` (e.g., `user.type.ts`, `app.enums.ts`, `user.interface.ts`).
- **Test Files:** Match the source file name + suffix (e.g., `UserCard.test.tsx`, `authService.spec.ts`).

## SEO & Accessibility (a11y)
- **Semantic HTML:** Strictly use semantic landmark tags (`<main>`, `<section>`, `<article>`, `<nav>`, `<aside>`, `<footer>`) instead of generic `<div>` soup.
- **Heading Hierarchy:** Maintain strict chronological heading order (`<h1>` down to `<h6>`). Ensure exactly ONE `<h1>` exists per page/route. Do not skip heading levels.
- **Media & Icons:** All `<img>` tags MUST have meaningful `alt` attributes. Empty `alt=""` is only allowed for purely decorative images. Icon-only buttons MUST have an `aria-label` or visually hidden text (`sr-only`).
- **Dynamic Meta:** Ensure document titles and meta tags are dynamically updated per route (using custom hooks or existing meta libraries) to support SPA indexing.

## Performance & Lighthouse (Web Vitals)
- **Prevent CLS (Cumulative Layout Shift):** ALWAYS explicitly define `width` and `height` attributes for `<img>`, or use Tailwind's aspect ratio utilities (`aspect-video`, `aspect-square`) to reserve layout space before the image loads.
- **Optimize LCP (Largest Contentful Paint):** Preload critical above-the-fold resources. Use `loading="lazy"` ONLY for images that are below the fold.
- **Code Splitting & Lazy Loading:** Use React's `lazy()` or React Router's lazy loading features for route-level components to minimize the initial JS bundle payload.
- **Tree-Shaking:** Import specific modules from libraries rather than the entire package (e.g., `import { format } from 'date-fns'` instead of `import dateFns from 'date-fns'`).
- **Interaction to Next Paint (INP):** Do not block the main thread. Defer heavy synchronous computations outside of the render cycle.
