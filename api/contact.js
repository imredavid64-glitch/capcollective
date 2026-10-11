// /api/contact.js — contact + newsletter form endpoint.
// Uses Resend when configured; otherwise returns 501 so the page falls back to mailto.
// Env: RESEND_API_KEY (optional)   CONTACT_TO (optional; default hello@capcollective.org)
// In: { name, email, message, newsletter?, topic? }

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CAPBOT_ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const key = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO || "hello@capcollective.org";
  if (!key) return res.status(501).json({ error: "not_configured", hint: "Set RESEND_API_KEY to enable the contact form." });

  let body = req.body && typeof req.body === "object" ? req.body : {};
  if (typeof req.body === "string") {
    try { body = JSON.parse(req.body); } catch { body = {}; }
  }
  const name = String(body.name || "").slice(0, 120);
  const email = String(body.email || "").slice(0, 200);
  const message = String(body.message || "").slice(0, 3000);
  const topic = String(body.topic || "General").slice(0, 80);

  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !message) {
    return res.status(400).json({ error: "Please provide name, a valid email, and a message." });
  }

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "Cap Collective <onboarding@resend.dev>",
        to: [to],
        reply_to: email,
        subject: `Cap Collective contact — ${topic}`,
        text: `From: ${name} <${email}>\nTopic: ${topic}\nNewsletter: ${body.newsletter ? "yes" : "no"}\n\n${message}`,
      }),
    });
    if (!r.ok) {
      const detail = await r.text();
      console.error("Resend error", r.status, detail.slice(0, 400));
      return res.status(502).json({ error: "send_failed" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact failure", err);
    return res.status(500).json({ error: "contact_error" });
  }
};