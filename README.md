# MFE Vite Boilerplate

## Educational Purpose

This project was created primarily for **educational and learning purposes**.  
While it is well-structured and could technically be used in production, it is **not intended for commercialization**.  
The main goal is to explore and demonstrate best practices, patterns, and technologies in software development — in this case, a **framework-agnostic micro-frontend architecture** built on Vite Module Federation.

## Description

**MFE Vite Boilerplate** is a production-ready starting point for building **micro-frontend applications** with Vite 7 and Module Federation. It is not a UI kit or a framework — it is the foundation you clone once and stop rebuilding from scratch every time you need to split a frontend into independently deployable pieces.

**The problem it solves:** micro-frontend setups historically meant Webpack 5 Module Federation, slow dev servers, and a lot of hand-wired boilerplate to make remotes mount, share dependencies, and talk to the host. On top of that, most examples assume every team uses the same framework. This boilerplate answers those decisions upfront: a Vite-based host that lazy-loads remotes over Module Federation, a **universal mount/unmount contract** that works across React, Angular, and Vue, a **shared package** that centralizes framework-agnostic code, and a consistent tooling/testing/CI setup replicated per package.

**What it includes:**

- **Vite 7 + `@module-federation/vite`** — every package is an independent Vite app with instant dev server startup and fast HMR. The container is the host; the rest are remotes exposed as ES modules over `remoteEntry.js`.
- **Cross-framework remotes** — `home`, `not-found`, `product`, `context` (React 19), `about` (Angular 19 via `@analogjs/vite-plugin-angular`), and `users` (Vue 3). All of them implement the same mount contract and are loaded uniformly by the host.
- **Universal mount contract** — every remote exposes `{ mount(container, options), unmount(container) }`. The host mounts a remote into a plain `HTMLElement` and tears it down on route change, regardless of the underlying framework.
- **`shared` SDK remote** — a federated remote (port `4000`) that centralizes framework-agnostic code (domain types, CSS variables/reset) and React building blocks (`Link`, `Action`, `InheritedProvider`, `useInheritedContext`, the `mount`/`unmount` factory, and `LinkModule`/`ActionModule` component mounts). It exposes them as `./sdk` over `remoteEntry.js`; every remote declares `shared` in its `remotes` and imports the public API from `shared/sdk` at runtime, so the shared code (and React itself) loads once across the whole app. Source files inside a package resolve shared modules through the `@shared/*` path alias.
- **Cross-MFE communication** — remotes never import the host. They receive `callbacks` at mount time (`onNavigate` for routing, optional `onEvent` for events). The `context` remote demonstrates a counter that emits `MfeCounterChangeEvent` up to the host; the `users` remote receives a `User[]` array the host fetched from an API.
- **Shared singletons** — `react`, `react-dom`, `react-router-dom`, and `vue` are negotiated as singletons across remotes via Module Federation, so they load once.
- **Async bootstrap pattern** — each remote follows `index → bootstrap` so Module Federation can negotiate shared dependencies before the app renders, and each remote can also run **standalone** (its own `index.html` + `bootstrap`).
- **Centralized, strict type system** — TypeScript strict mode with `noUncheckedIndexedAccess`, `noImplicitOverride`, and `exactOptionalPropertyTypes`. Types live under each package's `src/types/`, split by concern (props, states, contexts, hooks, env, domain models).
- **Testing per package** — React/Angular packages use **Jest 30 + ts-jest + jsdom** (container also uses **MSW** for network mocks); the Vue package uses **Vitest 3 + @testing-library/vue**. Coverage threshold enforced at 70% across branches, functions, lines, and statements.
- **ESLint + Prettier + Git hooks** — a single repo-wide `pre-commit` hook runs `lint-staged` only on the packages whose files are staged. Hooks install automatically when you run `npm install` inside `container`.
- **GitHub Actions CI** — per-package `lint-and-audit → test → build` pipelines plus a Docker build matrix for every package's dev and prod images.

**How to use it:**

1. Clone the repository and install dependencies in each package (see [Getting Started](#getting-started)).
2. Rename the packages in their `package.json` files and update the HTML titles in each `index.html`.
3. Set environment variables per package following each `.env.example`.
4. Add, remove, or replace remotes — each remote is a sibling folder of `container` and `shared`. Wire a new remote into the host by adding it to `container/vite.config.ts` (`remotes`), `container/src/types/remotes.d.ts`, and the router. The mount contract, shared library, tooling, and CI conventions stay exactly as they are.
5. Replace placeholder values before deploying (domains in `public/robots.txt` and `index.html`, author metadata, `start_url` in `public/manifest.json`).

## Technologies Used

1. React 19
2. Angular 19
3. Vue 3
4. TypeScript 5
5. Vite 7
6. Module Federation (`@module-federation/vite`)
7. HTML5
8. CSS3
9. Docker
10. Nginx
11. Jest / Vitest

## Libraries Used

### Host & React remotes (`container`, `home`, `not-found`, `product`, `context`)

#### Dependencies

```
"react": "^19.2.4"
"react-dom": "^19.2.4"
"react-router-dom": "7.13.2"   (container only)
```

#### DevDependencies

```
"@eslint/js": "^9.0.0"
"@module-federation/vite": "^1.15.5"
"@testing-library/dom": "^10.4.0"
"@testing-library/jest-dom": "^6.6.3"
"@testing-library/react": "^16.0.1"
"@testing-library/user-event": "^14.5.2"
"@types/jest": "^30.0.0"
"@types/node": "^22.0.0"
"@types/postcss-prefix-selector": "^1.16.3" (remotes only)
"@types/react": "^19.2.14"
"@types/react-dom": "^19.2.3"
"@vitejs/plugin-react": "^5.0.2"
"eslint": "^9.0.0"
"eslint-config-prettier": "^9.0.0"
"eslint-plugin-prettier": "^5.5.5"
"eslint-plugin-react-hooks": "^5.0.0"
"eslint-plugin-react-refresh": "^0.4.0"
"globals": "^15.0.0"
"jest": "^30.3.0"
"jest-environment-jsdom": "^30.3.0"
"lint-staged": "^15.0.0"
"msw": "2.10.4"               (container only)
"postcss-prefix-selector": "^2.1.1"        (remotes only — CSS isolation)
"prettier": "^3.0.0"
"ts-jest": "^29.4.6"
"typescript": "^5.2.2"
"typescript-eslint": "^8.0.0"
"undici": "^7.25.0"           (container only)
"vite": "^7.1.6"
"vite-plugin-css-injected-by-js": "^4.0.1" (remotes only — CSS loading)
```

### Angular remote (`about`)

#### Dependencies

```
"@angular/common": "^19.2.0"
"@angular/compiler": "^19.2.0"
"@angular/core": "^19.2.0"
"@angular/platform-browser": "^19.2.0"
"react": "^19.2.4"
"react-dom": "^19.2.4"
"zone.js": "^0.15.0"
```

#### DevDependencies (Angular-specific)

```
"@analogjs/vite-plugin-angular": "^1.16.0"
"@angular/build": "^19.2.26"
"@angular/compiler-cli": "^19.2.22"
"angular-eslint": "^19.0.0"
```

### Vue remote (`users`)

#### Dependencies

```
"react": "^19.2.4"
"react-dom": "^19.2.4"
"vue": "^3.5.34"
```

#### DevDependencies (Vue-specific)

```
"@testing-library/vue": "^8.1.0"
"@vitejs/plugin-vue": "^6.0.7"
"@vue/test-utils": "^2.4.6"
"eslint-plugin-vue": "^9.32.0"
"jsdom": "^26.1.0"
"vitest": "^3.2.0"
"vue-eslint-parser": "^9.4.3"
"vue-tsc": "^2.2.0"
```

### Shared SDK remote (`shared`)

Built with `@module-federation/vite` as a remote that **exposes its public API as `./sdk`** (`src/exports.ts`) over `remoteEntry.js`. Consumers import it at runtime as `shared/sdk` and declare it in their own `remotes` (default entry `http://localhost:4000/remoteEntry.js`, overridable via `VITE_REMOTE_SHARED_URL`); `react`/`react-dom` are negotiated as shared singletons. Like the other remotes it uses `vite-plugin-css-injected-by-js` + `postcss-prefix-selector` for CSS loading/isolation (scoped under `[data-mfe="shared"]`), and it compiles JSX with esbuild's automatic runtime instead of `@vitejs/plugin-react` — the React Fast Refresh preamble would otherwise break the barrel when it is loaded into a Vue/Angular host. Inside any package, source files resolve shared modules through the `@shared/*` path alias.

## Getting Started

This is a **monorepo of independent packages** — there is no root `package.json`. Each package (`container`, `shared`, `home`, `about`, `users`, `not-found`, `product`, `context`) installs and runs on its own.

1. Clone the repository.
2. Navigate to the project folder.
3. Install dependencies in **every** package. For example:

   ```bash
   for d in shared container home about users not-found product context; do
     (cd "$d" && npm install)
   done
   ```

   > Installing inside `container` runs its `prepare` script, which points Git at `.githooks` (`git config core.hooksPath .githooks`) and activates the repo-wide pre-commit hook.

4. Copy each `.env.example` to `.env` and adjust values (see [Env Keys](#env-keys)):

   ```bash
   cp container/.env.example container/.env
   cp home/.env.example home/.env
   # ...repeat per package
   ```

5. Start `shared` first (every remote loads its SDK at runtime), then the rest of the remotes, then the host. Each command runs from inside its package folder:

   | Package     | Command       | Dev URL                 |
   | ----------- | ------------- | ----------------------- |
   | `shared`    | `npm run dev` | `http://localhost:4000` |
   | `home`      | `npm run dev` | `http://localhost:3010` |
   | `about`     | `npm run dev` | `http://localhost:3020` |
   | `users`     | `npm run dev` | `http://localhost:3030` |
   | `not-found` | `npm run dev` | `http://localhost:3040` |
   | `product`   | `npm run dev` | `http://localhost:3050` |
   | `context`   | `npm run dev` | `http://localhost:3060` |
   | `container` | `npm run dev` | `http://localhost:3000` |

The host application runs at `http://localhost:3000` and lazy-loads each remote's `remoteEntry.js` on navigation. The `shared` SDK remote runs on port `4000`; every other remote fetches its `remoteEntry.js` (imported as `shared/sdk`) at runtime, so it must be up before the remotes. `shared` also serves a standalone dev playground on the same port for working on shared components in isolation.

### Pre-Commit for Development

Code quality is enforced through a single repo-wide Git hook in [`.githooks/pre-commit`](.githooks/pre-commit). On every commit it inspects the staged files and runs `lint-staged` **only** for the packages that have staged changes, so committing a change in `users` never lints `about`.

The hook is wired up by `container`'s `prepare` script (`git config core.hooksPath .githooks`), which runs automatically after `npm install` inside `container`. If hooks are not active after a fresh clone, run the install again or set the path manually:

```bash
git config core.hooksPath .githooks
```

Each package's `lint-staged` config runs ESLint `--fix` on its source files (`.ts`/`.tsx`/`.vue`, depending on the framework) and Prettier `--write` on `.css`, `.json`, and `.md`.

**ESLint** is configured with TypeScript strict rules via `typescript-eslint`, plus framework plugins (`eslint-plugin-react-hooks` / `eslint-plugin-react-refresh` for React, `angular-eslint` for Angular, `eslint-plugin-vue` for Vue):

- Explicit return types
- No `any`
- Consistent type imports
- No unused variables

**Prettier** enforces consistent formatting (see `.prettierrc` and the root [`.editorconfig`](.editorconfig)):

- 2 spaces indentation
- Semicolons required
- Double quotes
- Trailing commas (ES5)
- Print width 100

You can also run the tools manually outside the commit flow (from inside any package):

| Command                | Description                   |
| ---------------------- | ----------------------------- |
| `npm run lint`         | Check for linting errors      |
| `npm run lint:fix`     | Fix linting errors            |
| `npm run lint:all`     | Fix linting all (src + tests) |
| `npm run format`       | Format code with Prettier     |
| `npm run format:check` | Check code formatting         |
| `npm run format:all`   | Format Prettier (src + tests) |

## Env Keys

Environment variables are parsed and typed once per package in `src/constants/envs.ts`; raw `import.meta.env` access is not spread across the codebase.

### `container`

| Key                                 | Description                                                                        |
| ----------------------------------- | ---------------------------------------------------------------------------------- |
| `VITE_REDIRECT_IF_ROUTE_NOT_EXISTS` | If `true`, redirects to home when route doesn't exist. If `false`, shows 404 page. |
| `VITE_APP_NAME`                     | Display name for the host app.                                                     |
| `VITE_REMOTE_HOME_URL`              | URL of the `home` remote `remoteEntry.js`.                                         |
| `VITE_REMOTE_ABOUT_URL`             | URL of the `about` remote `remoteEntry.js`.                                        |
| `VITE_REMOTE_USERS_URL`             | URL of the `users` remote `remoteEntry.js`.                                        |
| `VITE_REMOTE_NOT_FOUND_URL`         | URL of the `not-found` remote `remoteEntry.js`.                                    |
| `VITE_REMOTE_PRODUCT_URL`           | URL of the `product` remote `remoteEntry.js`.                                      |
| `VITE_REMOTE_CONTEXT_URL`           | URL of the `context` remote `remoteEntry.js`.                                      |
| `VITE_REMOTE_SHARED_URL`            | URL of the `shared` SDK remote `remoteEntry.js`.                                   |
| `VITE_API_URL`                      | Upstream API proxied at `/api/users`.                                              |
| `WATCHPACK_POLLING`                 | Enable file-watch polling (useful inside Docker).                                  |

Example `container/.env`:

```bash
VITE_REDIRECT_IF_ROUTE_NOT_EXISTS=false
VITE_APP_NAME=container
VITE_REMOTE_HOME_URL=http://localhost:3010/remoteEntry.js
VITE_REMOTE_ABOUT_URL=http://localhost:3020/remoteEntry.js
VITE_REMOTE_USERS_URL=http://localhost:3030/remoteEntry.js
VITE_REMOTE_NOT_FOUND_URL=http://localhost:3040/remoteEntry.js
VITE_REMOTE_PRODUCT_URL=http://localhost:3050/remoteEntry.js
VITE_REMOTE_CONTEXT_URL=http://localhost:3060/remoteEntry.js
VITE_REMOTE_SHARED_URL=http://localhost:4000/remoteEntry.js
VITE_API_URL=https://jsonplaceholder.typicode.com

WATCHPACK_POLLING=true
```

### Remotes (`shared`, `home`, `about`, `users`, `not-found`, `product`, `context`)

| Key                      | Description                                                                                                                         |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------- |
| `VITE_APP_NAME`          | Display name when the remote runs standalone.                                                                                       |
| `VITE_REMOTE_SHARED_URL` | URL of the `shared` SDK remote `remoteEntry.js`, consumed by the framework remotes (not `shared` itself). Optional — defaults to `http://localhost:4000/remoteEntry.js`. |
| `WATCHPACK_POLLING`      | Enable file-watch polling (useful inside Docker).                                                                                   |

Example remote `.env`:

```bash
VITE_APP_NAME=home

WATCHPACK_POLLING=true
```

## Project Structure

With the apps running and configured, here is how the monorepo is organized:

```
mfe-vite-boilerplate/
├── .editorconfig                   # Shared editor formatting rules
├── .github/
│   └── workflows/
│       └── ci.yml                  # Per-package CI + Docker build matrix
├── .githooks/
│   └── pre-commit                  # Repo-wide hook: lint-staged per staged package
├── .vscode/
│   └── extensions.json             # Recommended editor extensions
├── run-tests.sh                    # Run every package's tests in parallel
├── LICENSE
├── README.md
│
├── shared/                         # Framework-agnostic + React SDK remote — exposes ./sdk (port 4000)
│   └── src/
│       ├── exports.ts              # Public API barrel (exposed as ./sdk → imported as shared/sdk)
│       ├── mount.tsx               # Universal React app mount/unmount factory
│       ├── components/             # Link, Action, MfeErrorBoundary (+ component mounts)
│       ├── contexts/               # InheritedContext / InheritedProvider
│       ├── hooks/                  # useInheritedContext
│       ├── helpers/                # createComponentMount<P>
│       ├── styles/                 # global.css (CSS variables/reset)
│       └── types/                  # mfe.ts (mount contract), app.ts, props.ts, contexts.ts
│
├── container/                      # React host / shell (port 3000)
│   └── src/
│       ├── App.tsx                 # BrowserRouter + ContainerRouter
│       ├── router/                 # ContainerRouter, PublicRoute
│       ├── components/             # RemoteMfe, UsersApp, ProductApp, ContextApp, DefaultLoading, ErrorBoundary
│       ├── hooks/                  # useMfeCallbacks (wraps onNavigate)
│       ├── services/               # userService (fetch /api/users)
│       ├── constants/              # envs.ts
│       └── types/                  # remotes.d.ts, props.ts, states.ts, responses.ts, hooks.ts
│
├── home/                           # React remote — landing page (port 3010, exposes ./HomeApp)
├── about/                          # Angular 19 remote (port 3020, exposes ./AboutApp)
├── users/                          # Vue 3 remote (port 3030, exposes ./UsersApp)
├── not-found/                      # React remote — 404 page (port 3040, exposes ./NotFoundApp)
├── product/                        # React remote — product detail (port 3050, exposes ./ProductApp)
└── context/                        # React remote — counter/event demo (port 3060, exposes ./ContextApp)
```

Every package follows the same internal shape:

```
<package>/
├── __tests__/                      # Test suite mirroring src/
│   └── __mocks__/                  # Shared mocks (callbacks, envs, styles, files)
├── public/                         # Static assets (favicon, manifest, robots.txt)
├── src/
│   ├── index.(ts|tsx)              # Entry point
│   ├── bootstrap.(ts|tsx)          # Async bootstrap (standalone render)
│   ├── mount.(ts|tsx)              # Federated mount/unmount (remotes only)
│   ├── constants/envs.(ts)         # Typed env access
│   └── types/                      # Types split by concern
├── Dockerfile.development
├── Dockerfile.production
├── nginx.conf                      # Production static serving config
├── eslint.config.js
├── jest.config.js | vitest config
├── tsconfig*.json
├── vite.config.ts
├── .nvmrc                          # Node 22
└── .env.example
```

| Folder / File       | Description                                                              |
| ------------------- | ------------------------------------------------------------------------ |
| `shared/`           | SDK remote — exposes shared code as `./sdk`; source resolved via `@shared/*`         |
| `container/`        | The host that declares remotes, owns routing, and mounts each MFE        |
| `home`/`not-found`/…| Remote MFEs — independently buildable and deployable                     |
| `<pkg>/src/mount.*` | The federated entry implementing the `MfeModule` contract                |
| `<pkg>/src/types/`  | TypeScript interfaces and types, split by concern                        |
| `<pkg>/__tests__/`  | Tests mirroring `src/`, grouped by source category                       |

## Architecture & Design Patterns

The folder structure above maps directly onto the architectural layers described in this section.

### Micro-Frontend Topology

```
                          ┌──────────────────────────┐
                          │   container (React host)  │  :3000
                          │  router · RemoteMfe loader│
                          └──────────────┬────────────┘
        lazy import remoteEntry.js  ──────┼──────  pass { callbacks, ...mountData }
   ┌───────────┬───────────┬─────────────┼─────────────┬───────────┐
   ▼           ▼           ▼             ▼             ▼           ▼
 home       about       users        not-found     product     context
 React      Angular     Vue 3         React         React       React
 :3010      :3020       :3030         :3040         :3050       :3060
   └────────────┴────────── import shared/sdk ────────┴───────────┘
                              │
                              ▼
                  ┌────────────────────────────────┐
                  │  shared — SDK remote   :4000    │
                  │  exposes ./sdk: Link, Action,   │
                  │  mount/unmount, shared types …  │
                  └────────────────────────────────┘
```

The host imports nothing framework-specific from a remote — it imports a **module** that satisfies the mount contract and calls `mount`/`unmount` against a DOM node. This is what makes the architecture framework-agnostic: a React host orchestrates Angular and Vue remotes identically.

### The Mount Contract

Every remote exposes a module shaped like `MfeModule` (defined in `shared/src/types/mfe.ts`):

```typescript
interface MfeCallbacks {
  onNavigate: (path: string) => void;
  onEvent?: (event: MfeEvent) => void;
}

interface MfeMountOptions {
  callbacks: MfeCallbacks;
  onError?: (error: Error) => void;
}

interface MfeModule {
  mount: (container: HTMLElement, options: MfeMountOptions) => void;
  unmount: (container: HTMLElement) => void;
}
```

Each framework implements it natively:

| Remote                                | `mount` implementation                                                                                                 | `unmount`                           |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- | ----------------------------------- |
| React (`home`, `not-found`, `context`) | `shared`'s `mount(App, container, options)` factory — wraps in `StrictMode` + `MfeErrorBoundary` + `InheritedProvider` | `root.unmount()` (queued microtask) |
| React (`product`)                     | Custom root render with `InheritedProvider` + extra `productId` prop                                                   | `root.unmount()`                    |
| Angular (`about`)                     | `createApplication()` + `MFE_CALLBACKS` provider + `createComponent()` + `attachView()`                                | `appRef.destroy()`                  |
| Vue (`users`)                         | `createApp(UsersPage, { users })` + `app.provide("mfeCallbacks", callbacks)`                                           | `app.unmount()`                     |

### Host MFE Loader

`container/src/components/RemoteMfe.tsx` is a generic loader used for every remote:

1. Receives a `loadModule` async import, `callbacks`, and optional `mountData`.
2. On mount, dynamically imports the remote module, normalizes `default` vs named export, and calls `mod.mount(container, { callbacks, onError, ...mountData })`.
3. Shows `DefaultLoading` while loading and a retryable error panel (`role="alert"`) if the remote fails.
4. On unmount/route change, calls `mod.unmount(container)` and cancels in-flight loads.

### Cross-MFE Communication

Remotes never reach into the host. Communication flows through the `callbacks` object passed at mount time:

- **Navigation** — a remote calls `callbacks.onNavigate(path)`; the host's `useMfeCallbacks` hook bridges it to React Router's `navigate`. The shared `Link` component uses this under the hood.
- **Events** — the `context` remote's counter emits `MfeCounterChangeEvent` via `callbacks.onEvent`; the host's `ContextApp` listens and reflects the value in a banner.
- **Data down** — the host fetches `User[]` from the API and passes it to the Vue `users` remote as `mountData.users`; the `product` route passes `productId` from the URL.

### Shared Package

`shared` is itself a **federated remote**: it exposes its public surface as `./sdk` over `remoteEntry.js`, and every remote declares `shared` in its `remotes` and imports it at runtime as `shared/sdk`. Source files within a package import shared modules through the `@shared/*` path alias instead — Vite, the TypeScript `paths`, and the Jest/Vitest configs all resolve `@shared/*` to `shared/src`. (The container only imports **types** from `shared/sdk`, which are erased at compile time, so it never loads the remote at runtime.) `shared/sdk` exports:

- React components: `Link`, `Action`
- Context primitives: `InheritedProvider`, `useInheritedContext` (the `InheritedContext` type is re-exported via `export type * from "@shared/types"`)
- The universal app factory: `mount`, `unmount`
- Component-level mounts for non-React hosts: `LinkModule`, `ActionModule` (via `createComponentMount<P>`)
- All shared types (`MfeModule`, `MfeCallbacks`, `User`, …)

This lets the Angular and Vue remotes embed the same React `Link`/`Action` components by mounting them into a DOM node — the cross-framework demo. Because `react`/`react-dom` are negotiated as Module Federation singletons, the shared code and React itself load once across every remote.

### CSS Isolation & Loading

Module Federation loads a remote's JavaScript at runtime but, in a production build, never injects the remote's extracted CSS into the host — so federated remotes would mount unstyled. On top of that, every remote's styles share the host's single document, so plain class names (`.title`, `.card`) would collide across MFEs. Two build-time pieces solve both (configured in every remote's `vite.config.ts`):

- **Loading** — [`vite-plugin-css-injected-by-js`](https://www.npmjs.com/package/vite-plugin-css-injected-by-js) (with `relativeCSSInjection: true`) inlines each chunk's CSS into its JS and injects a `<style>` tag at runtime. The CSS lands in the shared app chunk that both the federated entry (`mount`) and the standalone entry (`bootstrap`) import, so styling works in the host **and** when running the remote on its own.
- **Isolation** — [`postcss-prefix-selector`](https://www.npmjs.com/package/postcss-prefix-selector) scopes every rule under `[data-mfe="<name>"]` (root-level `:root`/`html`/`body` are remapped onto the scope, since the host owns the real document root). Those scoped selectors only match inside an element carrying that attribute, so each entry provides the anchor: the **federated** entry's `mount` stamps `container.dataset.mfe = "<name>"` on the host-supplied container, and the **standalone** entry's `index.html` ships it on the mount root (`<div id="root" data-mfe="<name>">`). Either way the styles apply, and identical class names in different MFEs never clash.

> Note: because `:root`/`html`/`body` are remapped onto the scope, a remote's `body` layout (e.g. `min-height: 100vh`) applies to its container element rather than the document body. The host owns the real page chrome.

Pinned to `vite-plugin-css-injected-by-js@4` (v5 requires Vite 8; this project is on Vite 7).

### Routing

The container uses React Router v7 (`BrowserRouter`). `PublicRoute` wraps all routes as a layout via `<Outlet />`, ready to be extended with auth guards. Route map:

| Path                   | Remote / Component | Framework |
| ---------------------- | ------------------ | --------- |
| `/`                    | `home`             | React     |
| `/about`               | `about`            | Angular   |
| `/users`               | `users`            | Vue 3     |
| `/context`             | `context`          | React     |
| `/products/:productId` | `product`          | React     |
| `/not-found`           | `not-found`        | React     |
| `/*`                   | redirect / 404     | —         |

The catch-all redirects to `/` or `/not-found` based on `VITE_REDIRECT_IF_ROUTE_NOT_EXISTS`, making 404 behavior configurable without code changes.

### Service Layer

The container's `userService` calls `fetch` against the `/api/users` proxy (configured in `vite.config.ts` for dev and `nginx.conf` for prod, both pointing at `jsonplaceholder.typicode.com`). The `/api` prefix avoids colliding with the `/users` SPA route. Services throw on non-`ok` responses so callers handle errors with `try/catch`.

### Type Safety

TypeScript strict mode is enabled with `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noUnusedLocals/Parameters`, and `exactOptionalPropertyTypes`. Federated remotes are typed for the host in `container/src/types/remotes.d.ts`. Env variables are parsed once per package in `src/constants/envs.ts`.

### Semantic HTML & Accessibility

Components favor semantic elements and accessible roles — `role="status"` on loading states, `role="alert"` on error panels, `rel="noopener noreferrer"` on external links, and `type="button"` on buttons to prevent accidental form submission.

## Testing

Tests mirror each package's `src/` structure under `__tests__/`, with shared mocks in `__tests__/__mocks__/`.

- **React / Angular packages** — **Jest 30** with `ts-jest`, `jest-environment-jsdom`, and Testing Library. The `container` package additionally uses **MSW v2** (`undici` polyfills) to intercept HTTP at the network level so no real traffic leaves the runner.
- **Vue package (`users`)** — **Vitest 3** with `@testing-library/vue` and `jsdom`.
- Components and remotes are tested in isolation; mount/unmount lifecycles and the `callbacks` contract are asserted directly.
- Coverage threshold is enforced at **70%** across branches, functions, lines, and statements.

### Run tests

From inside any package:

| Command                 | Description                    |
| ----------------------- | ------------------------------ |
| `npm run test`          | Run tests once                 |
| `npm run test:watch`    | Run tests in watch mode        |
| `npm run test:coverage` | Run tests with coverage report |

### Run every package's tests at once

The root [`run-tests.sh`](run-tests.sh) runs all packages' suites **in parallel**, streams each one's output under a colored header, and prints a pass/fail summary:

```bash
bash run-tests.sh
```

## Security Audit

Once the test suite is green, audit dependencies before building. Run inside each package:

```bash
npm audit
```

CI runs `npm audit --audit-level=high` per package (non-blocking) as part of the `lint-and-audit` stage.

## Build

With tests passing and the audit reviewed, generate an optimized production bundle. Run inside each package:

```bash
npm run build
```

For React/Vue host-style packages this runs a type-check (`tsc`/`vue-tsc`) before `vite build`; Vite outputs static assets (and remotes' `remoteEntry.js`) to `dist/`. Verify a build locally with:

```bash
npm run preview
```

> Build order matters in production: `shared` is built and served first (every remote fetches its `./sdk`), then the rest of the remotes, then the container so it can resolve each `VITE_REMOTE_*_URL`. The Docker build copies `shared`'s source into every remote image (for the `@shared` alias) and injects the remote URLs into the container at build time.

## Continuous Integration

The repository ships with a **GitHub Actions** pipeline defined in [`.github/workflows/ci.yml`](.github/workflows/ci.yml). It runs on every `push` and `pull_request` targeting `main` and gates merges by chaining the same checks you run locally — per package.

### Pipeline overview

```
                 ┌─── PR or push to main ───┐
                 ▼                          ▼
   For each package (shared, container, home, about, users, not-found, product, context):

   ┌──────────────────┐   ┌──────────────┐   ┌──────────────┐
   │  lint-and-audit  │──▶│    testing   │──▶│     build    │
   │ lint·format·types│   │   npm test   │   │   npm build  │
   │   · npm audit    │   │              │   │              │
   └──────────────────┘   └──────────────┘   └──────────────┘
                                                     │
                            all builds ──────────────┘
                                   ▼
                          ┌──────────────────┐
                          │   docker-build   │  matrix: dev + prod per package
                          └──────────────────┘
```

Each job runs on `ubuntu-latest`, uses the Node version from each package's [`.nvmrc`](container/.nvmrc), and caches `npm` via `actions/setup-node@v4`. Within a package the jobs run sequentially through `needs:` — if linting fails, tests don't run; if tests fail, the build is skipped. Packages run independently of one another.

### Validation jobs (per package)

1. **`lint-and-audit`** — `npm ci --ignore-scripts`, then `npm run lint` (ESLint strict config), `npm run format:check` (Prettier), `npm run type-check` (`tsc`/`vue-tsc --noEmit`), and `npm audit --audit-level=high` (non-blocking).
2. **`testing`** — `npm run test` (Jest or Vitest) with the 70% coverage threshold; MSW intercepts network calls in the container suite.
3. **`build`** — `npm run build` from a fresh `npm ci` to catch type-only regressions and Vite build-time failures.

### Docker job

4. **`docker-build`** — a matrix that builds `Dockerfile.development` and `Dockerfile.production` for every package (including `shared`, now a remote), tagged `mfe-<package>:dev` / `mfe-<package>:prod`. Images are built inside the runner and discarded — nothing is pushed to a registry.

> The pipeline is intentionally scoped to validation only — no release job, no tagging, no artifact publishing. Version management and distribution belong to the consuming project.

## Production

Each package ships a **multi-stage Docker image** served by **nginx** running as a **non-root user** (`appuser`, UID 1001) on port **8080**.

### Architecture

```
Stage 1 — builder : node:22-alpine  →  npm ci (shared + package)  →  npm run build  →  dist/
Stage 2 — runner  : nginx:stable-alpine  →  serves dist/ on port 8080
```

Every framework-remote image copies the `shared` source alongside the target package so the `@shared` alias resolves at build time, and bakes the `shared` SDK remote URL (`VITE_REMOTE_SHARED_URL`) so the bundle can fetch `shared/sdk` at runtime. The `shared` image builds itself the same way as any other remote. The container image additionally accepts every remote URL as build args (`VITE_REMOTE_*_URL`) and bakes them into the bundle. No Node.js or source ends up in the final image — only nginx and the compiled static files.

In production the **container is the only public origin**. The remote services — including the `shared` SDK remote — run on the internal Docker network with **no published ports**, and the container's nginx reverse-proxies their federation artifacts under `/mfe/<name>/` (e.g. the browser fetches `/mfe/home/remoteEntry.js`, which nginx forwards to `home:8080/remoteEntry.js`; a remote's bundle in turn fetches `/mfe/shared/remoteEntry.js`). The baked `VITE_REMOTE_*_URL` values are therefore same-origin paths (`/mfe/<name>/remoteEntry.js`). The browser only ever talks to the container — same origin (no CORS) — and the remotes' standalone pages are never reachable in prod (each remote serves only `remoteEntry.js` + `/assets/*` and 404s everything else). This mirrors the correct production topology where remotes are internal services behind the host, not separately browsable sites. (In dev each MFE still runs standalone on its own Vite port.)

### Build and run (Prod)

Production is orchestrated with `prod.docker-compose.yml`, which builds every image, keeps the remotes on an internal network, and publishes **only the container** on port 8080:

```bash
docker compose -f prod.docker-compose.yml up --build
# open http://localhost:8080  (the remote ports 808x are intentionally not published)
```

Images build from the **repository root** (the build context must include `shared`). The container bakes the remotes' URLs as build args — now same-origin paths (`/mfe/<name>/remoteEntry.js`) that its nginx reverse-proxies to each internal service. Individual images can still be built for inspection (`docker build -f home/Dockerfile.production -t mfe-home:prod .`), but a remote run on its own only serves `remoteEntry.js` + `/assets/*` — its standalone page returns 404 by design.

### What the production images include

| Feature                   | Detail                                                                                                                                    |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| **Non-root execution**    | nginx runs as `appuser` (UID 1001); listens on port 8080 to avoid privileged binding                                                      |
| **Gzip compression**      | Enabled for JS, CSS, JSON, SVG, and text ≥ 1 KB                                                                                           |
| **Static asset caching**  | JS, CSS, images, and fonts served with `Cache-Control: public, immutable` (`expires 1y`)                                                  |
| **No-cache remoteEntry**  | `remoteEntry.js` served with `no-cache, no-store, must-revalidate` so remotes can be redeployed independently                             |
| **Single public origin**  | Only the container publishes a port; remotes run internally and are reverse-proxied at `/mfe/<name>/` — same origin, so no CORS is needed |
| **No standalone in prod** | Remotes serve only `remoteEntry.js` + `/assets/*` and 404 everything else, so their standalone pages aren't reachable                     |
| **SPA routing (host)**    | The container falls back to `index.html` for client-side routing                                                                          |
| **API proxy (host)**      | The container proxies `/api/users` to the upstream API — no direct cross-origin requests from the browser                                 |
| **Security headers**      | `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`                      |

### Development with Docker (Dev)

Each package also ships a `Dockerfile.development` that runs `npm run dev` with the Vite server exposed, as an alternative to the local flow in [Getting Started](#getting-started).

## Known Issues

None at the moment.

## Portfolio Link

[`https://www.diegolibonati.com.ar/#/project/mfe-vite-boilerplate`](https://www.diegolibonati.com.ar/#/project/mfe-vite-boilerplate)
