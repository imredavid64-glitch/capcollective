// /api/tracker.js — live cap-collection data source for the tracker page.
// Backed by Vercel KV when configured; otherwise a seeded in-memory store
// (resets on cold start — fine for demos, see kit/29 for the real sensor path).
//
// Optional env vars:
//   KV_REST_API_URL     e.g. https://your-kv.redwood.vercel.app
//   KV_REST_API_TOKEN   from the Vercel KV dashboard
//
// In:  POST { school, classLabel, caps, date? }
// Out: GET  { totals, bySchool, byClass, recent, forecastUrl }

const G_PER_CAP = 2.5;
const KG_CO2E_PER_KG = 1.9;

let inMemory = null;
function seed() {
  const rows = [
    { school: "AISB", classLabel: "5B", caps: 1240, date: "2026-08-15" },
    { school: "AISB", classLabel: "6A", caps: 980, date: "2026-08-20" },
    { school: "AISB", classLabel: "7B", caps: 1560, date: "2026-09-02" },
    { school: "AISB", classLabel: "8A", caps: 890, date: "2026-09-11" },
    { school: "AISB", classLabel: "9B", caps: 1720, date: "2026-09-19" },
    { school: "AISB", classLabel: "10C", caps: 1430, date: "2026-09-27" },
    { school: "AISB", classLabel: "3A", caps: 640, date: "2026-10-03" },
    { school: "AISB", classLabel: "4B", caps: 720, date: "2026-10-10" },
    { school: "AISB", classLabel: "6A", caps: 1110, date: "2026-10-17" },
    { school: "AISB", classLabel: "8A", caps: 1340, date: "2026-10-24" },
    { school: "Greenfield", classLabel: "Year 5", caps: 760, date: "2026-10-05" },
    { school: "Greenfield", classLabel: "Year 6", caps: 950, date: "2026-10-19" },
    { school: "Greenfield", classLabel: "Year 7", caps: 1180, date: "2026-11-02" },
  ];
  const now = new Date().toISOString().slice(0, 10);
  rows.push({ school: "AISB", classLabel: "7B", caps: 1250, date: now });
  return rows;
}

function agg(rows) {
  const totalCaps = rows.reduce((s, r) => s + r.caps, 0);
  const kg = Math.round((totalCaps * G_PER_CAP) / 1000);
  const co2e = Math.round((totalCaps * G_PER_CAP * KG_CO2E_PER_KG) / 1000);
  const bySchool = [];
  const byClass = [];
  const sMap = new Map();
  const cMap = new Map();
  for (const r of rows) {
    sMap.set(r.school, (sMap.get(r.school) || 0) + r.caps);
    const key = `${r.school} · ${r.classLabel}`;
    cMap.set(key, (cMap.get(key) || 0) + r.caps);
  }
  for (const [k, v] of sMap) bySchool.push({ name: k, caps: v });
  for (const [k, v] of cMap) byClass.push({ name: k, caps: v, kg: Math.round((v * G_PER_CAP) / 1000) });
  bySchool.sort((a, b) => b.caps - a.caps);
  byClass.sort((a, b) => b.caps - a.caps);
  const recent = [...rows].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 10);
  const monthly = [];
  const mMap = new Map();
  for (const r of rows) {
    const { label, ofs } = (() => {
      if (!r.date || !/^\d{4}-\d{2}/.test(r.date)) return { label: "other", ofs: 99 };
      const [y, m] = r.date.split("-").map(Number);
      const names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return { label: `${names[m - 1]} ’${String(y).slice(2)}`, ofs: y * 12 + m };
    })();
    mMap.set(label, (mMap.get(label) || { ofs, caps: 0 }));
    mMap.get(label).caps += r.caps;
  }
  const arr = [...mMap.entries()];
  arr.sort((a, b) => a[1].ofs - b[1].ofs);
  for (const [label, v] of arr) monthly.push({ label, value: v.caps });
  return { totalCaps, kg, co2e, bySchool, byClass, recent, monthly };
}

async function load() {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN && inMemory === null) {
    try {
      const r = await fetch(`${process.env.KV_REST_API_URL}/get/trackerRows`, {
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}` },
      });
      if (r.ok) {
        const d = await r.json();
        if (Array.isArray(d.result)) return d.result;
      }
    } catch (e) {
      console.error("KV load failed", e.message);
    }
  }
  if (!inMemory) inMemory = seed();
  return inMemory;
}

async function save(rows) {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      await fetch(`${process.env.KV_REST_API_URL}/set/trackerRows`, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.KV_REST_API_TOKEN}`, "Content-Type": "application/json" },
        body: JSON.stringify({ value: rows }),
      });
      return;
    } catch (e) {
      console.error("KV save failed", e.message);
    }
  }
  inMemory = rows;
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CAPBOT_ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  let rows = await load();

  if (req.method === "POST") {
    let body = req.body && typeof req.body === "object" ? req.body : {};
    if (typeof req.body === "string") {
      try { body = JSON.parse(req.body); } catch { body = {}; }
    }
    const school = String(body.school || "AISB").slice(0, 60);
    const classLabel = String(body.classLabel || "Student").slice(0, 60);
    const caps = parseInt(body.caps, 10);
    if (!caps || caps < 1 || caps > 100000) {
      return res.status(400).json({ error: "caps must be between 1 and 100000." });
    }
    const date = /^\d{4}-\d{2}-\d{2}$/.test(String(body.date || "")) ? body.date : new Date().toISOString().slice(0, 10);
    rows.push({ school, classLabel, caps, date });
    await save(rows);
  }

  return res.status(200).json({ ...agg(rows), source: process.env.KV_REST_API_URL ? "kv" : "memory" });
};