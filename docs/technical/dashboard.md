---
title: Dashboard Deployment
---

# Cap Collective — Website & Live Dashboard Deployment Guide
### Stand Up Your Public Impact Dashboard in ~1 Hour (No Coding)
**For the Data Analyst role + IT helper | Pairs with Command Center**

---

## WHAT YOU'RE BUILDING
Two things:
1. **Internal Command Center** — the Google Sheets workbook where you log data (already specified).
2. **Public Live Dashboard / Website** — a shareable page anyone can view (students, parents, funders) showing real-time impact.

You can do this **without writing code**. Two options:

| Option | Difficulty | Cost | Best For |
|--------|-----------|------|----------|
| **A. Looker Studio (Google)** | ★☆☆ Easy | Free | Everyone — 30 min setup |
| **B. Next.js on Vercel** | ★★★ Hard | Free | 9-12 CS students, custom design |

> The kit references URLs `capcollective.vercel.app` and `bottle-cap-tracker.vercel.app`. Those must be built — Option A below is the fast path; Option B is the student-coding version.

---

## OPTION A — LOOKER STUDIO DASHBOARD (Recommended, No Code)

### Step 1: Build the data source
1. Create the **Command Center** Google Sheet (`03_...` + `csv/`).
2. Make sure the **Impact Dashboard** tab has the metric formulas filled.

### Step 2: Connect Looker Studio
1. Go to **lookerstudio.google.com** (free, school Google account).
2. **Create → Report**.
3. **Add data → Google Sheets →** select your Command Center.
4. Pick the **Impact Dashboard** tab (or Collection Tracker for time series).

### Step 3: Build the visuals (drag & drop)
| Visual | Data | Setup |
|--------|------|-------|
| **Scorecards** | Caps Collected, Weight (kg), Revenue, Students | One scorecard per metric |
| **Time series** | Date vs Cap Count | From Collection Tracker |
| **Bar chart** | Collection by Location | Dimension=Location, Metric=Count |
| **Pie chart** | Product mix | From Product Inventory |
| **Gauge** | % of 10k goal | Middle = target |
| **Table** | Class leaderboard | From Student Roles/sheets |

### Step 4: Style it
- Add the **Cap Collective logo** (image).
- Title: "Cap Collective — Live Impact at [School]"
- Colors: greens (#1B5E20, #A5D6A7).
- Add the school name and a "last updated" note.

### Step 5: Share & embed
- **Share → Anyone with link can view.**
- **File → Embed report** → copy the `<iframe>` code.
- Paste into your school website, Google Site, or newsletter.

### Step 6: Make a QR code
- Copy the report link.
- Generate a QR at **qr-code-generator.com** or any free tool.
- Print on box signs (Printable Resources) so students scan to see impact.

**Done. The dashboard auto-updates as you log data.**

---

## OPTION B — NEXT.JS + VERCEL WEBSITE (Advanced / Student Coding Project)

Perfect for the 9-12 "Cap Systems Designers" as a CS project.

### Stack
- **Next.js** (React) — the site
- **Vercel** — free hosting (gives `*.vercel.app` URL)
- **Google Sheets API** or a JSON endpoint — data source
- **Tailwind CSS** — styling

### Roadmap
```
1. `npx create-next-app@latest cap-collective`
2. Build a single page: hero, live stats, product gallery, about.
3. Fetch data:
   - Simplest: publish the Impact tab as CSV (File → Share → Publish
     to web → CSV) and fetch + parse it.
   - Better: Google Sheets API v4 with a read-only key.
4. Deploy: push to GitHub → connect to Vercel → auto-deploy.
5. Custom domain (optional): via Vercel dashboard.
```

### Minimal data fetch (CSV publish method)
```javascript
// pages or app component
export async function getImpact() {
  const url = "https://docs.google.com/spreadsheets/d/XXXX/pub?gid=YYYY&single=true&output=csv";
  const res = await fetch(url, { cache: "no-store" });
  const text = await res.text();
  const [header, ...rows] = text.trim().split("\n");
  // parse rows into metrics
  return rows.map(r => r.split(","));
}
```
*Replace XXXX/YYYY with your sheet ID and tab gid (visible in the URL).*

### Suggested page sections
1. **Hero:** "Cap Collective at [School]" + live cap counter.
2. **Impact stats:** 4 big numbers (caps, kg, CO₂e, students).
3. **Progress bar:** toward 10,000.
4. **Products:** gallery with prices + "buy at our Eco-Store."
5. **Story:** the 5-step process.
6. **Partners:** café logos, sponsors.
7. **Footer:** contact + QR to the dashboard.

### Deploy to Vercel
```
git init
git add .
git commit -m "Cap Collective site"
# create repo on GitHub, then:
git remote add origin https://github.com/[you]/cap-collective.git
git push -u origin main
# then vercel.com → New Project → import repo → Deploy
# → you get https://cap-collective.vercel.app
```
Update `capcollective.vercel.app` / `bottle-cap-tracker.vercel.app` references once live (or use your own subdomain).

---

## SENSOR → SHEETS → DASHBOARD PIPELINE (Full Data Flow)
```
[IR Sensor on box] → [ESP32] → POST JSON → [Google Apps Script webhook]
        → appends row to "Sensor Data Log" tab
        → Impact Dashboard formulas update
        → Looker Studio dashboard refreshes
        → students/funders see live numbers
```
**Apps Script webhook code:** see `resources/sensor_count.ino` (bottom) and `03_COMMAND_CENTER_SHEETS.md` Tab 8.

**No sensors yet?** Log manually in the Collection Tracker — the dashboard works the same.

---

## WEBSITE / DASHBOARD QA CHECKLIST
```
☐ Command Center built and populated with sample data
☐ Impact Dashboard formulas return correct numbers
☐ Looker Studio (or Next.js) connected and displaying
☐ Shared: anyone with link can view
☐ Embedded on school site / linked in newsletter
☐ QR code generated and printed on box signs
☐ Privacy check: no student names shown publicly
☐ "Last updated" visible
☐ Mobile-view test (most scan QR on phones)
☐ Funder-ready: numbers exportable to reports
```

---

## PRIVACY & SAFETY (IT-facing)
- Public dashboard = **aggregates only** (counts, weights, %). Never names.
- Internal sheets with student data = access-controlled.
- Sensor payloads contain no personal data.
- Everything can run **offline** (manual counting) if IT declines network access.

---

## TROUBLESHOOTING
| Problem | Fix |
|---------|-----|
| Looker numbers stale | Sheet recalculates on open; open the sheet or use live connector |
| CSV publish not updating | Re-publish; check tab gid in URL |
| Sensor not posting | Check WiFi, webhook URL, Apps Script "Anyone" access |
| Dashboard blank | Check data types (numbers vs text) in the sheet |
| Vercel build fails | Check Node version; read build log; keep dependencies minimal |
| Mixed student names leak public | Remove name fields from any published range |

---
*Dashboard Deployment v1.0 — Option A launches today; Option B is a student CS unit.*