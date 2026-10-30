# Cap Collective — Remaining Gaps & Technical Debt

> Companion to `00_IMPLEMENTATION_READINESS_AUDIT.md`. The audit scored the kit 10/10 for
> school implementation. This document lists the **remaining technical/developer gaps**
> found during a deeper audit, with severity and recommended action.

## How to read

- **Severity:** Critical / High / Medium / Low
- **Status:** Fixed (in this pass) / Open (action needed)

---

## A. Repository hygiene

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| A1 | No root `.gitignore` — `node_modules/`, `.next/`, `site/` could be committed | High | **Fixed** (added `.gitignore`) |
| A2 | CI triggers on `main`/`develop` but default branch is `master` — CI never ran | High | **Fixed** (branches → `master`) |
| A3 | Markdown-lint job used `cache: 'npm'` with no root `package.json` — would fail | Medium | **Fixed** |
| A4 | `cap-collective-dashboard/node_modules` and `.next` present locally (bloat) | Low | Resolved — gitignored; delete locally to reclaim disk |
| A5 | No `requirements-docs.txt` referenced by docs workflow (harmless) | Low | Open |
| A6 | Firmware CI step used `pio run … \|\| true` with wrong env names — **never compiled anything** | High | **Fixed** (real compile, correct envs, cached) |
| A7 | Duplicate/stale sketches outside `src/` (PlatformIO only builds `src/`) | Medium | **Fixed** (single `src/main.ino` per project) |
| A8 | `.pio/` build artifacts not gitignored | Low | **Fixed** |

## B. Dashboard (Next.js)

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| B1 | No ESLint config → `npm run lint` prompted interactively, CI would hang | High | **Fixed** (`.eslintrc.json` + 1 lint fix) |
| B2 | Dashboard is Google-Sheets-only; Supabase schema exists but unused | Medium | Open — document as "two backends" or wire Supabase |
| B3 | Hardcoded GIDs in `src/lib/data.ts` | Medium | **Fixed** (env-driven with fallback) |
| B4 | No tests (unit/e2e) | Low | **Fixed** — 22 vitest unit tests wired into CI |
| B5 | `metadataBase` not set → OG image uses localhost | Low | **Fixed** |
| B6 | Vercel only ever produced **Preview** deployments — no production build; `vercel.json` used a legacy `@sheets_id` secret ref; `NEXT_PUBLIC_GID_*` all default to `0` | High | **Config fixed** — `vercel.json` no longer sets a static `out` directory or secret ref, cron is Hobby-compatible, and the README documents root dir / production branch / env vars. Still needs Vercel project settings (manual) |
| B7 | `parseCsv` left whitespace inside quoted cells (` " Alex " ` → ` Alex `) | Low | **Fixed** — strip quotes then trim (covered by tests) |

## C. Firmware (ESP32)

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| C1 | `node2_cap_counter.ino` was a 1-line stub | High | **Fixed** — minimal ESP-NOW Node 2 firmware added in `src/main.ino` |
| C2 | `node1_cap_counter.ino` stub was a stray print | Medium | **Fixed** |
| C3 | PlatformIO projects had no `src/` directory | High | **Fixed** (src/main.ino + huge_app.csv added) |
| C4 | `ESPSupabase` placeholder library reference | High | **Fixed** — replaced with `HTTPClient` PostgREST upload; radio tower compiles |
| C5 | Hardcoded WiFi SSID/password **committed to a public repo** | Critical | **Fixed in tree** — moved to gitignored `secrets.h`; **you must rotate the WiFi password** (still in git history) |
| C6 | Missing `huge_app.csv` partition file | Low | **Fixed** |
| C7 | Invalid PlatformIO board IDs / env names (`esp32s3dev`, `esp32s3cam`) — would never build | High | **Fixed** (`esp32-s3-devkitm-1`, `freenove_esp32_s3_wroom`, `esp32dev`) |
| C8 | `ARDUINO_USB_CDC_ON_BOOT` overridden on boards without native USB / conflicting with board manifest | Medium | **Fixed** (removed; classic ESP32 redefined `Serial` to `HWCDCSerial`) |
| C9 | ESP-NOW send callback used the deprecated signature | Medium | **Fixed** (`wifi_tx_info_t*`) |

## D. Documentation site (MkDocs)

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| D1 | 6 broken relative links in `docs/` | Medium | **Fixed** |
| D2 | `sync_docs.py` hardcoded Windows path | Medium | **Fixed** (relative to script) |
| D3 | `sync_docs.py` not wired into docs workflow | Low | **Fixed** |
| D4 | No spell-check gating (cspell runs but allow-fail?) | Low | **Fixed** — blocking; dictionary covers domain terms |
| D5 | Docs workflow pushed to a `gh-pages` branch while Pages `build_type` was `workflow` — the live site served stale content and `.html` URLs | High | **Fixed** — switched to `upload-pages-artifact` + `deploy-pages`; live site now serves directory URLs and the Visual Tracker |
| D6 | `mkdocs.yml` shipped a placeholder GA4 ID (`G-XXXXXXXXXX`) and cookie consent, so analytics was broken/lying | Low | **Fixed** — both commented out with instructions until a real property exists |

## E. Data / spreadsheets

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| E1 | Missing CSVs for Tabs 3 & 4 | Medium | **Fixed** (`csv/07_`, `csv/08_`) |
| E2 | CSVs have inconsistent trailing-column counts (cosmetic) | Low | **Fixed** — formula cells with commas are now properly quoted, so every file in `csv/` parses to its header width |
| E3 | Multi-section tabs (Budget, Impact) could not be imported as a single table | Medium | **Fixed** — `07a/07b/07c` and `05b` single-table files; combined budget workbook moved to `csv/reference/` |

## F. Content / kit completeness

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| F1 | CAD folder only has parametric SCAD starters — no final STL/DXF (acknowledged external dep) | Medium | Open (external) |
| F2 | README Discord badge uses placeholder server id | Low | **Fixed** |
| F3 | No `CHANGELOG` automation for root md → docs drift over time | Low | Open |
| F4 | Readiness audit overclaim 10/10 | Medium | **Fixed** (note added) |
| F5 | Every `@capcollective.org` address (support@, security@, conduct@, …) bounces — the domain has no MX records | High | Open — needs email routing on the domain, or the addresses should be replaced with GitHub Issues/Discussions links |
| F6 | GitHub Sponsors not enabled on the profile, so the Sponsor button and `FUNDING.yml` do nothing | Medium | Open — enable at `github.com/settings/sponsors` |

## Recommended next actions (remaining)

1. **Email (F5):** either add MX records / email forwarding for `capcollective.org`,
   or swap the 13 published addresses for GitHub Issues + Discussions links.
2. **Sponsors (F6):** enable GitHub Sponsors so the Sponsor button works.
3. **Vercel (B6):** set Root Directory `cap-collective-dashboard`, Production Branch
   `master`, and the `NEXT_PUBLIC_*` env vars so a production build exists.
4. **Supabase (B2):** wire it into the dashboard or remove the references — the
   schema exists but nothing uses it.
5. **CAD (F1):** add real STL/DXF files (external dependency).
6. **Changelog drift (F3):** generate `CHANGELOG.md` from git history in CI.

---

*Generated during a deeper kit audit. Re-run after addressing items above.*
