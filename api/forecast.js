// /api/forecast.js — simple trend forecast for cap collection (CapBot + tracker)
// In:   { "series": [ { "label": "Sep", "value": 1200 }, ... ], "steps": 12 }
// Out:  { "points": [{ "label", "value", "kind": "actual"|"forecast" }], "projectedTotal", "trend": "up"|"down"|"flat" }

const DEFAULT_SERIES = [
  { label: "Aug", value: 1400 },
  { label: "Sep", value: 1850 },
  { label: "Oct", value: 2100 },
  { label: "Nov", value: 2600 },
  { label: "Dec", value: 2350 },
  { label: "Jan", value: 2900 },
  { label: "Feb", value: 3350 },
  { label: "Mar", value: 3800 },
];

function validateSeries(s) {
  if (!Array.isArray(s)) return null;
  const out = s
    .filter((p) => p && typeof p.value === "number")
    .slice(-24)
    .map((p) => ({ label: String(p.label || ""), value: p.value }));
  return out.length >= 2 ? out : null;
}

function linreg(xs, ys) {
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((a, x, i) => a + x * ys[i], 0);
  const sxx = xs.reduce((a, x) => a + x * x, 0);
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx || 1);
  const a = sy / n - b * (sx / n);
  return { a, b };
}

module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.CAPBOT_ALLOW_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();

  let body = {};
  if (req.method === "POST") {
    body = req.body && typeof req.body === "object" ? req.body : {};
  }

  let series = validateSeries(body.series);
  const provided = !!series;
  if (!series) series = DEFAULT_SERIES;

  const steps = Math.min(Math.max(parseInt(body.steps || 12, 10) || 12, 1), 60);

  const n = series.length;
  const xs = series.map((_, i) => i);
  const ys = series.map((p) => p.value);
  const { a, b } = linreg(xs, ys);

  const points = series.map((p) => ({ ...p, kind: "actual" }));
  let forecastTotal = 0;
  for (let i = 1; i <= steps; i++) {
    const v = Math.max(0, Math.round(a + b * (n - 1 + i)));
    forecastTotal += v;
    points.push({ label: `+${i}`, value: v, kind: "forecast" });
  }

  const trend = b > series.length * 5 ? "up" : b < -series.length * 5 ? "down" : "flat";
  const avgPerMonth = Math.round(ys.reduce((x, y) => x + y, 0) / n);
  const projectedTotal = avgPerMonth * steps;

  return res.status(200).json({
    points,
    steps,
    slope: Number(b.toFixed(2)),
    trend,
    avgPerMonth,
    projectedTotal,
    provided,
    generatedAt: new Date().toISOString(),
  });
};