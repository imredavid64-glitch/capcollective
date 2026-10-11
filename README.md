# The Cap Collective

Student-led circular recycling program: collect bottle caps → clean → shred → melt → refine into products that fund the school garden.

This repository hosts the **website**, the **CapBot AI assistant**, and the **implementation kit** assets.

---

## Repository contents

| Path | What it is |
|------|-----------|
| `index.html` | The single-page website (Tailwind, no build step) |
| `api/chat.js` | CapBot serverless endpoint — talks to the LLM with a server-side key |
| `assets/` | Downloadable PDFs (Program Overview + Full Implementation Kit) |
| `kit/` | The full markdown implementation kit (29 documents) |
| `vercel.json` | Serverless function config |
| `.env.example` | Required environment variables |

---

## The website

- Pure static HTML + Tailwind CDN — opens directly in a browser.
- Sections: Hero, About, How We Recycle, Impact Calculator, Products, **Impact Stats**, **For Schools / Get the Kit**, **Safety**, **FAQ**, Resources, Footer, and the **CapBot** chat widget.

### Add your links
Search `index.html` for `https://github.com/imredavid64-glitch/capcollective` and the Google Slides URL to update destinations. The CapBot endpoint is configured here:

```js
const CAPBOT_ENDPOINT = "/api/chat";   // same-origin when hosted on Vercel
```

---

## CapBot AI assistant

CapBot is a floating chat widget that answers questions about the program. It calls `api/chat.js`, which calls the **Gemini API** using a **server-side API key** — the key is never exposed to the browser.

**Setup:** see [`DEPLOY_CAPBOT.md`](./DEPLOY_CAPBOT.md).

- Required env var: `GEMINI_API_KEY`
- Optional: `GEMINI_MODEL` (default `gemini-3.5-flash`), `CAPBOT_ALLOW_ORIGIN`

---

## Deploy

### Option A — Vercel (enables CapBot; recommended)
1. Import this repo at [vercel.com/new](https://vercel.com/new).
2. Add the `GEMINI_API_KEY` environment variable.
3. Deploy. The site and `/api/chat` both go live together.

### Option B — GitHub Pages (static only)
Pages serves `index.html` and `assets/`. The CapBot widget needs a reachable endpoint — deploy `api/chat.js` on Vercel and set `CAPBOT_ENDPOINT` to its absolute URL.

---

## The Implementation Kit

The full kit (29 documents) is in `kit/` and compiled into `assets/CapCollective_Implementation_Kit.pdf`.
It covers: readiness audit, launch deck, buy-in & approvals, procurement & finance, teacher guide, safety SOPs, Command Center sheets, curriculum mapping, lesson plans, worksheets, certification & training, launch & communications, Eco-Store ops, product dev & QC, engagement, accessibility, impact reporting, district scaling, continuity, and data-science/AI extensions.

Free to adapt for any school.

---

*Join the Bridge. Create the Impact.*
