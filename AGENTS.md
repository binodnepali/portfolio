# AGENTS.md

Guidance for AI agents working in this repository.

## Project overview

Personal portfolio website (https://binodnepali.me) built with **Deno Fresh**
(server-side rendering + islands), **Preact**, and **Tailwind CSS**. It also
exposes a few JSON/ICS API endpoints under `routes/api/`.

## Tech stack

- Runtime: **Deno** (use >= 2.4 locally; `deno deploy` and some tooling need
  it).
- Framework: **Fresh 1.6.8** (`$fresh/`), rendering with **Preact**
  (`jsx: react-jsx`, `jsxImportSource: preact`).
- Styling: **Tailwind CSS 3.4** via the Fresh tailwind plugin
  (`fresh.config.ts`).
- Storage: **Deno KV** (unstable, enabled via `"unstable": ["kv"]` in
  `deno.json`).
- HTML scraping: **deno_dom** (WASM) — never Puppeteer or Node-only libs.

Dependencies are managed through the import map in `deno.json`, not
`package.json`.

## Commands

Run from the repo root:

- `deno task start` — dev server with watch (http://localhost:8000).
- `deno task build` — production build (regenerates `fresh.gen.ts`, writes
  `_fresh/`).
- `deno task preview` — run the built app via `main.ts`.
- `deno task check` — **run before finishing changes**:
  `deno fmt --check && deno lint && deno check` over `.ts`/`.tsx`.
- `deno task manifest` — regenerate `fresh.gen.ts`.

When verifying your own edits, prefer scoping `deno fmt` / `deno lint` /
`deno check` to the files you touched, since unrelated files (e.g.
`CHANGELOG.md`) may already fail `deno fmt --check`.

## Project structure

- `routes/` — Fresh file-based routing.
  - `routes/index.tsx`, `_app.tsx`, `_404.tsx` — pages/layout.
  - `routes/api/**` — API handlers exporting `handler` (e.g. `profile.ts`,
    `ical/index.ts`, `ical/[year].ts`).
- `islands/` — interactive client components (hydrated; only place
  `useState`/event handlers belong).
- `components/` — server-rendered presentational components; shared primitives
  in `components/ui/`.
- `src/server/` — server-only logic (no JSX), e.g. `src/server/calendar/`
  (scraping, ICS building, caching).
- `src/types/` — shared TypeScript types/interfaces.
- `data/` — static JSON data (e.g. `linkedin-profile.json`).
- `static/` — static assets served at the web root.

`fresh.gen.ts` is auto-generated — never edit it by hand; it updates on
`deno task build`/`start`.

## Conventions

- Formatting/linting: use Deno's defaults (2-space indent, double quotes,
  semicolons) and the `["fresh", "recommended"]` lint rules. Do not hand-format
  against these.
- Components vs islands: keep components static; move anything needing browser
  state/interactivity into `islands/`. Guard browser-only behavior with
  `IS_BROWSER` from `$fresh/runtime.ts`.
- Types: import shared types from `src/types/`; avoid `any`.
- Don't add narrating comments; only comment non-obvious intent.

## Server / API guidelines

- This deploys to **Deno Deploy edge isolates**: use Web APIs (`fetch`,
  `Deno.serve` via Fresh) and Deno APIs only. **No Node built-ins, no
  Puppeteer/headless browser, no `npm:` packages that rely on Node internals.**
- Deno KV has a **64KB per-value limit** — store small values (the calendar
  cache is split per month for this reason). Wrap `kv.set` so an oversized write
  can't break a request.
- KV access should degrade gracefully: check `typeof Deno.openKv === "function"`
  and fall back to an in-memory cache (see `src/server/calendar/service.ts`).
- ICS/all-day dates: use `DTSTART;VALUE=DATE:YYYYMMDD` and read **local** date
  components (not UTC) to avoid off-by-one day shifts.

## Deployment

- Deploys via the **new Deno Deploy** dashboard GitHub integration — pushing to
  `main` triggers a production build automatically.
- There is intentionally **no GitHub Actions workflow** and no `deployctl`. Do
  not reintroduce them unless explicitly asked.

## Commits

This project follows **Conventional Commits** (`feat:`, `fix:`, etc.) and uses
`commit-and-tag-version` for releases (`CHANGELOG.md`). Match that style. Only
create commits when explicitly asked.

## Gotchas

- `deno task start` only watches `static/` and `routes/`. Changes under `src/`,
  `components/`, or `islands/` imported by the server may require a manual
  restart.
- First request to a calendar year is slow (scrapes 12 month pages); subsequent
  requests hit the KV/in-memory cache.
