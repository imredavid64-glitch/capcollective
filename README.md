# The Cap Collective

Student-led circular recycling program: collect bottle caps → clean → shred → melt → refine into products that fund the school garden.

This repository hosts the **website**, the **CapBot AI assistant**, the **live web tools**, and the **implementation kit** assets.

---

## Repository contents

| Path | What it is |
|------|-----------|
| `index.html` | The main website (Tailwind, no build step, EN/RO, CapBot) |
| `shop.html` | Eco-Store — catalog, cart, Stripe checkout + pickup orders |
| `tracker.html` | Live cap tracker — stats, forecast chart, leaderboards, log form |
| `learn.html` | Safety certification quiz with printable certificate |
| `gallery.html` | Impact gallery, testimonials, community drop-off map |
| `kit.html` | Searchable reader for all 33 kit modules |
| `api/chat.js` | CapBot serverless endpoint (Gemini, context-aware, rate-limited) |
| `api/checkout.js` | Stripe Checkout endpoint (Eco-Store) |
| `api/tracker.js` | Tracker read/write + aggregate endpoint (Vercel KV or in-memory) |
| `api/forecast.js` | Trend / forecast serverless endpoint |
| `api/contact.js` | Contact + newsletter endpoint (Resend) |
| `assets/` | Downloadable PDFs (Program Overview + Full Implementation Kit) |
| `kit/` | The full markdown implementation kit (33 modules + overview + plan) |
| `vercel.json` | Serverless function config |
| `.env.example` | Required environment variables |

---

## The website

- Pure static HTML + Tailwind CDN — opens directly in a browser.
- Sections: Hero, About, How We Recycle, Impact Calculator, Products, Impact Stats, For Schools / Get the Kit, Safety, FAQ, Resources, Contact, Footer, and the CapBot chat widget.
- **Languages:** EN / RO toggle (stored in localStorage).
- **Accessibility:** "Aa" toggle enables larger text + focus outlines.

### Serverless endpoints used by the pages

| Page | Endpoint(s) |
|---|---|
| CapBot widget | `/api/chat` (POST `{ messages, context }`) |
| Eco-Store | `/api/checkout` (POST `{ items, origin }`) |
| Live Tracker | `/api/tracker` (GET stats / POST a drop) + `/api/forecast` |
| Contact section | `/api/contact` (POST `{ name, email, topic, message, newsletter }`) |

---

## CapBot AI assistant

CapBot is a floating chat widget that answers questions about the program. It calls `api/chat.js`, which calls the **Gemini API** using a **server-side API key** — the key is never exposed to the browser. It supports:

- **Context focus chips** (All / Safety / Eco-Store / Tracker / The Kit) → sent with each message.
- **Voice input** (Web Speech API, where supported).
- **Error fallback** with retry + email chips.

**Setup:** see [`DEPLOY_CAPBOT.md`](./DEPLOY_CAPBOT.md).

---

## Deploy

### Option A — Vercel (enables all /api endpoints; recommended)
1. Import this repo at [vercel.com/new](https://vercel.com/new).
2. Add environment variables from `.env.example`.
3. Deploy. Site + every `/api/*` route go live together.

### Option B — GitHub Pages (static only)
Pages serves the HTML pages and `assets/`. Serverless features degrade gracefully:
- CapBot, checkout, contact and forecast need the `/api` routes — deploy them on Vercel and point the JS to absolute URLs, or the pages show their built-in fallbacks (pickup-order email form, etc.).

---

## The Implementation Kit

The full kit (33 modules) is in `kit/` and compiled into `assets/CapCollective_Implementation_Kit.pdf`.
It covers: readiness audit, launch deck, buy-in & approvals, procurement & finance, teacher guide, safety SOPs, Command Center sheets, curriculum mapping, lesson plans, worksheets, certification & training, launch & communications, Eco-Store ops, product dev & QC, engagement & gamification, accessibility, impact reporting, **IoT & live tracking**, supplier & partner directory, **train-the-trainer & ambassadors**, **digital products & online store**, district scaling, continuity, and data-science/AI extensions.

Browse every module online at `kit.html` (searchable) or grab the PDFs from `assets/`.

Free to adapt for any school.

---

*Join the Bridge. Create the Impact.*