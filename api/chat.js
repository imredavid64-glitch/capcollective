// /api/chat.js — CapBot serverless endpoint (Vercel, Node 18+ runtime)
// Keeps the Gemini API key secret on the server. The browser only talks to this route.
//
// Required env var:  GEMINI_API_KEY
// Optional env vars: GEMINI_MODEL (default: gemini-3.5-flash)
//                    CAPBOT_ALLOW_ORIGIN (default: "*")
//
// Deploy: import this GitHub repo into Vercel with root = repo root.
// Any /api/*.js file becomes a serverless function automatically.

const SYSTEM_PROMPT = `You are "CapBot", the friendly AI assistant for Cap Collective — a student-led school program that recycles plastic bottle caps into useful products.

PROGRAM KNOWLEDGE (use only this; if unsure, say so and point to the kit):
- Mission: capture HDPE (#2) and PP (#5) bottle caps and turn them into products (coasters, keychains, phone stands, desk organizers, plant pots, art tiles), funding the school garden.
- Problem: only ~3% of bottle caps are recycled; they fall through industrial sorting screens and often end up in landfill or the ocean.
- 5-step process: COLLECT (HDPE #2 / PP #5) -> CLEAN (remove liners, wash, air-dry 24h) -> SHRED (5-8mm flakes) -> MELT (heat press: HDPE ~140C, PP ~170C, NEVER above 200C) -> REFINE (laser-cut / inject / press).
- Closed loop: broken products are re-shredded, so the loop is 100% recyclable.
- Accepted plastics: HDPE (#2) and PP (#5) only. NEVER PVC (#3) — it releases toxic gas when heated.
- Safety is mandatory: no certification = no machine access; max 200C; ventilation required; PPE per station; every machine has an SOP and a certification card.
- Budget tiers: Core $500-$1,000 (pilots/primary); FabLab $2,500-$5,000 (middle/high makerspaces); Center $10,000+ (technical schools / district hubs).
- Impact targets per semester: 10,000+ caps, 35+ kg diverted, 65+ kg CO2e avoided, $500+ revenue, 80% participation.
- Curriculum: 4 grade bands — K-2 Cap Detectives, 3-5 Cap Engineers, 6-8 Cap Innovators, 9-12 Cap Systems Designers; 12 lesson plans mapped to NGSS/Common Core/IB.
- The free "Implementation Kit" has 33 documents covering pitch, approvals, funding, safety, curriculum, launch, store operations, IoT tracking, reporting, scaling and handover.

KEY LINKS:
- Browse the Kit online: kit.html (searchable reader with every module)
- Program Overview PDF: assets/CapCollective_Overview.pdf
- Full Implementation Kit PDF: assets/CapCollective_Implementation_Kit.pdf
- Live Cap Tracker & forecast: tracker.html
- Eco-Store (shop recycled products): shop.html
- Safety certification quiz: learn.html
- GitHub: https://github.com/imredavid64-glitch/capcollective

STYLE:
- Be warm, concise and encouraging. Aim for 2-4 short sentences unless more detail is asked.
- Use plain language a student, teacher or parent can follow.
- Use **bold** for key terms. When linking, use full https URLs.
- Never invent statistics, prices, or links that aren't above.
- If a question is outside Cap Collective, politely redirect to the program.
- Never give unsafe advice; always reinforce the 200C limit and certification requirement.`;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQ = 30;
const hits = new Map();

const CONTEXT_PROMPTS = {
  safety: `\n\nCONTEXT: The user is asking about SAFETY. Lead with certification-first: no certification = no machine access. Mention the 200C maximum, ventilated rooms, PPE per station, e-stop and fire blanket locations, and the quick quiz at learn.html for Foundation certification.`,
  store: `\n\nCONTEXT: The user is asking about the ECO-STORE. Products are student-made from recycled caps (coasters, keychains, phone stands, organizers, plant pots, art tiles); buyers can checkout online or order for pickup; revenue funds the school garden.`,
  tracker: `\n\nCONTEXT: The user is asking about the LIVE TRACKER / data. We log every cap (school, class, count), show leaderboards, and forecast future collection with a trend model. Soon hopper sensors push counts automatically (IoT).`,
  kit: `\n\nCONTEXT: The user is asking about the IMPLEMENTATION KIT. Point them to kit.html where every one of the 33 modules is searchable and PDF downloads are available.`,
};

function rateLimited(ip) {
  const now = Date.now();
  const rec = hits.get(ip) || { count: 0, start: now };
  if (now - rec.start > WINDOW_MS) { rec.count = 0; rec.start = now; }
  rec.count++;
  hits.set(ip, rec);
  return rec.count > MAX_REQ;
}

module.exports = async (req, res) => {
  const allowOrigin = process.env.CAPBOT_ALLOW_ORIGIN || "*";
  res.setHeader("Access-Control-Allow-Origin", allowOrigin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) return res.status(429).json({ error: "Too many requests. Please slow down." });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Server not configured (missing GEMINI_API_KEY)." });

  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }
  const messages = Array.isArray(body && body.messages) ? body.messages : null;
  if (!messages || !messages.length) return res.status(400).json({ error: "Missing 'messages'." });
  const context = typeof body.context === "string" ? body.context.trim().toLowerCase() : "";
  const systemText = SYSTEM_PROMPT + (CONTEXT_PROMPTS[context] || "");

  const contents = messages
    .filter((m) => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-10)
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content.slice(0, 2000) }],
    }));

  const model = process.env.GEMINI_MODEL || "gemini-3.5-flash";

  try {
    const r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${encodeURIComponent(apiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemText }] },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 500 },
          safetySettings: [
            { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
            { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_MEDIUM_AND_ABOVE" },
          ],
        }),
      }
    );

    if (!r.ok) {
      const detail = await r.text();
      console.error("Gemini error", r.status, detail);
      return res.status(502).json({ error: "The assistant is unavailable right now." });
    }

    const data = await r.json();
    let reply = "";
    if (data.candidates && data.candidates[0] && data.candidates[0].content &&
        data.candidates[0].content.parts) {
      reply = data.candidates[0].content.parts.map((p) => p.text || "").join("");
    }
    if (!reply) {
      const fin = data.candidates && data.candidates[0] && data.candidates[0].finishReason;
      reply = fin ? `The assistant couldn't answer that (${fin}). Please try rephrasing.` : "Sorry, I didn't have an answer for that.";
    }
    return res.status(200).json({ reply });
  } catch (err) {
    console.error("CapBot failure", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
};