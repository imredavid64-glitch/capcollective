# Deploying CapBot (the AI assistant)

CapBot needs a small server-side function so the LLM API key stays secret.
This repo ships that function at `api/chat.js`. Here's how to turn it on.

---

## 1. Get an API key

CapBot uses the **Gemini API** by default.

1. Go to <https://aistudio.google.com/apikey>
2. Click **Create API key** and copy it (keys look like `AQ.xxxx...`).
3. Keep it secret — paste it only into the Vercel dashboard, never into `index.html`.

---

## 2. Deploy the site + function on Vercel

1. Go to <https://vercel.com/new> and **import** the GitHub repo
   `imredavid64-glitch/capcollective`.
2. Framework preset: **Other** (it's a static site + one serverless function).
3. **Environment Variables** → add:
   | Name | Value |
   |------|-------|
   | `GEMINI_API_KEY` | your `AQ.…` key |
   | `GEMINI_MODEL` *(optional)* | `gemini-3.5-flash` |
   | `CAPBOT_ALLOW_ORIGIN` *(optional)* | `https://imredavid64-glitch.github.io` |
4. Click **Deploy**.

Vercel serves `index.html` at `/` and the function at `/api/chat`.
Because both are on the same origin, the widget's default
`CAPBOT_ENDPOINT = "/api/chat"` works with no changes.

---

## 3. Test it

1. Open your Vercel URL.
2. Click the green chat button (bottom-right).
3. Ask: *"How do we start at our school?"* — CapBot should reply.

You can also test the endpoint directly:

```bash
curl -X POST https://YOUR-APP.vercel.app/api/chat \
  -H "Content-Type: application/json" \
  -d "{\"messages\":[{\"role\":\"user\",\"content\":\"What is Cap Collective?\"}]}"
```

Expected: `{"reply":"..."}`

---

## 4. If you host the site on GitHub Pages

GitHub Pages can't run `/api` functions. Keep the site on Pages and host **only** the function on Vercel:

1. Deploy the `api/chat.js` function to Vercel (same steps above).
   Note the URL, e.g. `https://capcollective-api.vercel.app`.
2. In `index.html`, change:

   ```js
   const CAPBOT_ENDPOINT = "/api/chat";
   ```
   to
   ```js
   const CAPBOT_ENDPOINT = "https://capcollective-api.vercel.app/api/chat";
   ```
3. Set `CAPBOT_ALLOW_ORIGIN` on Vercel to your Pages origin
   (`https://imredavid64-glitch.github.io`) so the browser is allowed to call it.

---

## Swapping providers

`api/chat.js` is a thin wrapper around one API call. It currently targets the
Gemini `generateContent` endpoint. To use OpenAI instead, replace the fetch block
with `https://api.openai.com/v1/chat/completions` and translate the message roles.
The request/response shape the front-end expects stays the same:

- **In:** `{ "messages": [ { "role": "user", "content": "..." } ] }`
- **Out:** `{ "reply": "..." }`

---

## Costs & safety

- Each chat uses a small number of tokens. Flash-class Gemini models cost
  well under a cent per message for casual use.
- The function already includes: input truncation, a 30-requests/10-min per-IP
  rate limit, CORS control, explicit safety settings, and server-only key handling.
- Never commit your real `.env`. Only `.env.example` belongs in the repo.

---

## Customizing CapBot's knowledge

Edit the `SYSTEM_PROMPT` at the top of `api/chat.js` to change what CapBot knows
and how it speaks. Keep it factual — CapBot is instructed not to invent stats or links.