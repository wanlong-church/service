# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

萬隆服事表: the service-duty roster PWA for 萬隆基督的教會, served at `service.wlchurch.org.tw`. Next.js 16 (App Router) + React 19. The roster lives in Google Sheets; there is no database. UI copy, comments, and error messages are mostly Traditional Chinese (zh-TW); keep new user-facing text in zh-TW.

## Commands

Node 24 (`.nvmrc` / volta pin `24.16.0`), npm.

```bash
npm install
npm run prepare                      # install husky hooks
cp .env.local.template .env.local    # then add GOOGLE_PRIVATE_KEY and delete the sheet ID lines; see Environment
npm run dev                          # next dev --turbopack, bound to 0.0.0.0:3000
npm run build                        # next build --webpack, standalone output
npm run lint                         # eslint --fix on app components lib providers stores hooks, then tsc
npm test                             # vitest run
```

- Tests are vitest, colocated as `*.test.ts`. The sheet parser and the query-key module have them. CI runs `npm run lint`, `npm test`, and `npm run build`.
- `npm run lint` rewrites files in place (`--fix`).
- The pre-commit hook runs `npm install`, then lint-staged (`tsc`, `eslint --fix`, `prettier --write` on staged files).
- Keep `--webpack` on `build`. Dev uses Turbopack, but the standalone output deployed to App Engine is built with webpack (commit cb82c1e).
- With `SENTRY_AUTH_TOKEN` set, `npm run build` creates and uploads a Sentry release (`SENTRY_RELEASE`, `develop` locally).
- `node scripts/generate-apple-splash.mjs` regenerates `public/splash/*.png` from `public/ios/1024.png` and prints the matching `<link>` tags. It needs `sharp`, which is not in `package.json`.

## Environment

- `.env` is committed and holds non-secret config: `GOOGLE_CLIENT_EMAIL`, `GOOGLE_DRIVE_ENDPOINT` (used as the auth scope), `MAIN_SPREAD_SHEET_ID`, `NEXT_YEAR_SPREAD_SHEET_ID`.
- Secrets go in `.env.local` (gitignored) locally; CI writes them to `.env.production`: `GOOGLE_PRIVATE_KEY` (literal `\n` is converted to newlines at runtime) and `SENTRY_AUTH_TOKEN`.
- After copying `.env.local.template`, delete its `MAIN_SPREAD_SHEET_ID` and `NEXT_YEAR_SPREAD_SHEET_ID` lines. `.env.local` takes precedence over `.env`, and an unfilled `${...}` placeholder expands to an empty string, which blanks out the real IDs.
- Year rollover: in `.env`, set `MAIN_SPREAD_SHEET_ID` to the new current year's sheet and `NEXT_YEAR_SPREAD_SHEET_ID` to the following year's, then redeploy. The README gives the steps.

## Architecture

### Data flow

1. `app/api/google-sheet/route.ts` (server, `force-dynamic`) calls `utility.ts`. It authenticates with a service-account JWT through `googleapis` and reads range `總表!A:Z` from both the current-year and next-year spreadsheets.
2. `parse.ts` (`parseRosterSheet`, pure) parses each file with its own header row. The header is the first row in the top 5 that has a `日期` cell; today that is row 2, and data starts below it. The two files may order their columns differently.
3. Columns map to fields by header text, compared after NFKC normalization with all whitespace removed. NFKC turns full-width `（）` and digits into ASCII. Matching covers `COLUMN_MAPPING` plus `COLUMN_ALIASES`, and if two headers match one field, the first wins.
   - Unknown headers (貝士, 鼓) are dropped.
   - A field with no header gets a Sentry warning.
   - Rows with a blank date are skipped. Rows with an unparseable date are dropped and reported to Sentry.
   - A mapped cell holding a spreadsheet error value (`#REF!`, `#N/A`, ...) is replaced with `''` and recorded in `issues` with its A1 reference; `utility.ts` reports these to Sentry too.
   - A file with no header or no valid rows throws `SheetError` `NO_VALID_ROWS`.
   - Rows from both files are merged and sorted newest first.
4. `app/api/google-sheet/url/route.ts` returns the two sheets' edit URLs.
5. On the client, `app/api/client.ts` fetches those routes, and `app/service/_hooks/useGoogleSheet*.ts` wrap them in React Query. `useGoogleSheet` sets `throwOnError` only when no data is cached, so a failed sync with cached data keeps the page and shows a toast.

### Schema

`app/const.ts` is the schema:

- `SERVICE_TYPES`: duty roles, in sheet column order.
- `SHEET_FIELDS`: `date`, the roles, and the topic/special-day columns.
- `COLUMN_MAPPING`: field → sheet header text. The UI shows these as labels.
- `COLUMN_ALIASES`: other spellings of a header that already appear in the files, such as 愛宴 for 愛筵 and 音控 for 音控直播.
- `SERVICE_META`: per-role arrival time, notes, and manual links.

`app/type.ts` derives `ServiceType` and `SheetField` from those arrays. To add or rename a sheet column, update `SERVICE_TYPES`/`SHEET_FIELDS` and `COLUMN_MAPPING`; for a new role, also add `SERVICE_META`.

### Client caching

`providers/query-client-provider.tsx` persists the React Query cache to localStorage with a 7-day `staleTime` and infinite `gcTime`, so data is normally served from cache. The sync button (`app/service/_components/sync-button.tsx`) forces a refetch. Query errors show as toasts.

`next.config.mjs` inlines `NEXT_PUBLIC_APP_VERSION` (from `package.json`) as the persist `buster`, so a deploy drops old persisted payloads, and `NEXT_PUBLIC_MAIN_SPREAD_SHEET_ID`, which `QUERY_KEY` embeds so a year rollover (a new sheet ID, no version bump) also invalidates the cache.

### Pages

- `/` redirects to `/service`.
- `/service` (`app/service/page.tsx`, client component):
  - Without `?user=`, it renders `AllServiceView`: a month accordion that shows a desktop table or a mobile date picker with cards, chosen by `useMediaQuery`.
  - With `?user=<name>`, it renders `PersonalView`, the list of that person's duties.
  - Matching is a substring `includes`, so a name can match inside a longer cell.
  - `prayer` dates are moved back two days: the sheet row is dated Sunday, but the prayer meeting is on Friday.
- The selected user is persisted in a zustand store (`stores/useUserStore.ts`, localStorage) and synced with `?user=`. The bottom `Navigator` switches between the personal and full views.
- The page renders only after `useIsClient()` returns true, which avoids hydration mismatches from localStorage-backed state.

### PWA

- Serwist builds `app/sw.ts` to `public/sw.js`, which is gitignored and disabled in dev.
- Offline document requests fall back to `app/~offline`.
- `components/pwa/` has the install prompt and the Apple splash-screen links.

### UI and monitoring

- `components/ui/` holds shadcn/ui primitives.
- Tailwind is v4 with CSS-first config in `app/globals.css`. There is no `tailwind.config.ts`, though `components.json` still names one.
- The `@/*` import alias maps to the repo root.
- Sentry: `instrumentation.ts` loads `sentry.server.config.ts` and `sentry.edge.config.ts`. `next.config.mjs` wraps the config with `withSentryConfig` (org `wlchurch`, project `service`) and `withSerwist`.

## Conventions

- Prettier: no semicolons, single quotes, 100-column width, `trailingComma: 'es5'`, and the Tailwind class-sorting plugin. ESLint uses a flat config that extends `next/core-web-vitals` with prettier.
- Commit messages and PR titles use Conventional Commits (`feat`, `fix`, `build`, `chore`, `refactor`, `docs`, `test`), because release-please derives the version and `CHANGELOG.md` from them.
- Don't hand-edit `CHANGELOG.md`, the `package.json` version, or `.release-please-manifest.json`.

## Deployment

- **CI** (`.github/workflows/ci.yaml`): lint, test, and build on PRs and on pushes to `main`.
- **Release** (`release.yaml`): release-please runs on manual dispatch, or on a push whose commit message starts with `release:`. It opens a `release: release x.y.z` PR; merging that PR publishes a GitHub Release.
- **Deploy** (`deploy.yaml`): a published GitHub Release triggers a build and a deploy to Google App Engine (service `service`, runtime `nodejs24`, `app.yaml`). `.github/actions/release` puts `.next/standalone`, static assets, `public/`, and `app.yaml` into `standalone/` and swaps in `gcp/standalone-package.json`. It renames `node_modules` to `node_module_hack` so App Engine doesn't reinstall dependencies; the `gcp-build` script renames it back.
- **Routing**: route changes go in `dispatch.yaml`, deployed by hand with `gcloud app deploy dispatch.yaml`.
- **Sentry releases**: Vercel preview deploys (from the fork `schwannden/service`) report to Sentry as `preview`. GitHub Releases use the `package.json` version.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
