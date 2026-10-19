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
| A4 | `cap-collective-dashboard/node_modules` and `.next` present locally (bloat) | Low | Open — delete locally; now gitignored |
| A5 | No `requirements-docs.txt` referenced by docs workflow (harmless) | Low | Open |

## B. Dashboard (Next.js)

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| B1 | No ESLint config → `npm run lint` prompted interactively, CI would hang | High | **Fixed** (`.eslintrc.json` + 1 lint fix) |
| B2 | Dashboard is Google-Sheets-only; Supabase schema exists but unused | Medium | Open — document as "two backends" or wire Supabase |
| B3 | Hardcoded GIDs in `src/lib/data.ts` | Medium | **Fixed** (env-driven with fallback) |
| B4 | No tests (unit/e2e) | Low | Open |
| B5 | `metadataBase` not set → OG image uses localhost | Low | **Fixed** |

## C. Firmware (ESP32)

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| C1 | `node2_cap_counter.ino` was a 1-line stub | High | **Fixed** — minimal ESP-NOW Node 2 firmware added in `src/main.ino` |
| C2 | `node1_cap_counter.ino` stub was a stray print | Medium | **Fixed** |
| C3 | PlatformIO projects had no `src/` directory | High | **Fixed** (src/main.ino + huge_app.csv added) |
| C4 | `ESPSupabase` placeholder library reference | High | Open — documented REST alternative in README |
| C5 | Hardcoded Supabase key/URL in static dashboard + firmware | Medium | **Fixed** (placeholders) |
| C6 | Missing `huge_app.csv` partition file | Low | **Fixed** |

## D. Documentation site (MkDocs)

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| D1 | 6 broken relative links in `docs/` | Medium | **Fixed** |
| D2 | `sync_docs.py` hardcoded Windows path | Medium | **Fixed** (relative to script) |
| D3 | `sync_docs.py` not wired into docs workflow | Low | **Fixed** |
| D4 | No spell-check gating (cspell runs but allow-fail?) | Low | Open |

## E. Data / spreadsheets

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| E1 | Missing CSVs for Tabs 3 & 4 | Medium | **Fixed** (`csv/07_`, `csv/08_`) |
| E2 | CSVs have inconsistent trailing-column counts (cosmetic) | Low | Open |

## F. Content / kit completeness

| # | Gap | Severity | Status |
|---|-----|----------|--------|
| F1 | CAD folder only has parametric SCAD starters — no final STL/DXF (acknowledged external dep) | Medium | Open (external) |
| F2 | README Discord badge uses placeholder server id | Low | **Fixed** |
| F3 | No `CHANGELOG` automation for root md → docs drift over time | Low | Open |
| F4 | Readiness audit overclaim 10/10 | Medium | **Fixed** (note added) |

## Recommended next actions (remaining)

1. Provide a real ESPSupabase (or REST) client for the radio tower (C4) — blocks Center tier.
2. Wire Supabase into the Next.js dashboard OR remove Supabase references (B2) — removes confusion.
3. Add unit/e2e tests for the dashboard (B4).
4. Tidy CSV trailing-column counts (E2).
5. Add real CAD (STL/DXF) files (F1, external).

---

*Generated during a deeper kit audit. Re-run after addressing items above.*