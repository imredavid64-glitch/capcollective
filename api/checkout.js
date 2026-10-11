// /api/checkout.js — Eco-Store Stripe Checkout (no account = graceful fallback)
// In:  { "items": [ { "name": "Coaster Set", "qty": 2 } ], "origin": "https://..." }
// Out: { "url": "https://checkout.stripe.com/..." }  or  501 { "error": "not_configured" }
//
// Env: STRIPE_SECRET_KEY   (sk_test_... / sk_live_...)
//      STRIPE_WEBHOOK_SECRET (optional, future order fulfillment)

const CATALOG = {
  "Coaster Set": { priceCents: 1200, emoji: "🍥" },
  "Keychain": { priceCents: 350, emoji: "🔑" },
  "Phone Stand": { priceCents: 1500, emoji: "📱" },
  "Desk Organizer": { priceCents: 2200, emoji: "🗂️" },
  "Plant Pot": { priceCents: 1800, emoji: "🪴" },
  "Art Tile": { priceCents: 900, emoji: "🎨" },
  "CapSample Kit": { priceCents: 450, emoji: "🧪" },
};

function pick(items) {
  return (Array.isArray(items) ? items : [])
    .map((it) => {
      const meta = CATALOG[it.name];
      const qty = Math.min(Math.max(parseInt(it.qty, 10) || 1, 1), 20);
      return meta ? { name: it.name, qty, priceCents: meta.priceCents } : null;
    })
    .filter(Boolean);
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CAPBOT_ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return res.status(501).json({ error: "not_configured", hint: "Eco-Store is in pickup order mode until STRIPE_SECRET_KEY is set." });

  let body = req.body && typeof req.body === "object" ? req.body : {};
  const items = pick(body.items);
  if (!items.length) return res.status(400).json({ error: "No valid items in cart." });

  const origin = String(body.origin || "https://capcollective.vercel.app").slice(0, 200);

  try {
    const params = new URLSearchParams({
      mode: "payment",
      success_url: `${origin}/shop.html?paid=1`,
      cancel_url: `${origin}/shop.html?paid=0`,
    });
    items.forEach((it, i) => {
      params.append(`line_items[${i}][quantity]`, String(it.qty));
      params.append(`line_items[${i}][price_data][currency]`, "usd");
      params.append(`line_items[${i}][price_data][product_data][name]`, `${it.name} (Cap Collective Eco-Store)`);
      params.append(`line_items[${i}][price_data][unit_amount]`, String(it.priceCents));
    });

    const r = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params,
    });

    if (!r.ok) {
      const detail = await r.text();
      console.error("Stripe error", r.status, detail.slice(0, 500));
      return res.status(502).json({ error: "checkout_failed" });
    }
    const data = await r.json();
    return res.status(200).json({ url: data.url });
  } catch (err) {
    console.error("Checkout failure", err);
    return res.status(500).json({ error: "checkout_error" });
  }
};