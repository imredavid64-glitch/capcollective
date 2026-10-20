# Cap Collective — Live Impact Dashboard

A beautiful, real-time Next.js dashboard for the Cap Collective school circular economy program. Displays live data from Google Sheets including cap collection metrics, product revenue, student leaderboards, and IoT sensor status.

## Features

- **Real-time Metrics** — Caps collected, weight diverted, CO₂e avoided, revenue, student engagement
- **Live Charts** — Weekly collection trends (count & weight), product revenue mix
- **Student Leaderboard** — Top collectors with role badges and hours logged
- **IoT Sensor Status** — Live bin fill levels from ESP32 IR sensors
- **Responsive Design** — Works on mobile, tablet, and desktop
- **Accessible** — WCAG 2.1 AA compliant, keyboard navigable
- **Zero-Config Deploy** — Deploy to Vercel in minutes

## Quick Start

### 1. Install Dependencies

```bash
cd cap-collective-dashboard
npm install
```

### 2. Configure Google Sheets

1. Create a Google Sheet using the [Command Center template](https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/template)
2. Publish to web: **File → Share → Publish to web → Entire document → CSV**
3. Copy the Sheet ID from the URL: `https://docs.google.com/spreadsheets/d/{SHEET_ID}/edit`
4. Create `.env.local` from `.env.example` and add your Sheet ID:

```bash
cp .env.example .env.local
# Edit .env.local and add your SHEET_ID
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

### 4. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Or connect your GitHub repo to Vercel for automatic deployments
```

## Google Sheets Structure

The dashboard expects these tabs in your Google Sheet (matching the Command Center workbook):

| Tab Name | Required Columns |
|----------|------------------|
| **Impact Dashboard** | Caps Collected, Weight (kg), CO2e Avoided (kg), Products Made, Revenue ($), Students Engaged, Last Updated |
| **Collection Tracker** | Date, Count, Weight (kg), Location |
| **Product Inventory** | SKU, Product, Qty Made, Qty Sold, Price, Revenue, Material Cost, Margin |
| **Student Roles** | Student Name, Grade, Role, Hours Logged, Caps Collected |
| **Sensor Data Log** | Timestamp, Bin ID, Count, Fill %, Temperature, Status |

See `03_COMMAND_CENTER_SHEETS.md` in the main kit for full specification.

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with header/footer
│   ├── page.tsx           # Main dashboard page
│   └── globals.css        # Global styles + Tailwind
├── components/
│   ├── ui/                # Reusable UI components (Button, Card, Badge, etc.)
│   ├── dashboard/         # Dashboard-specific components
│   │   ├── StatCard.tsx   # Metric cards with progress bars
│   │   ├── CollectionChart.tsx  # Area charts for trends
│   │   ├── ProductMixChart.tsx  # Pie chart for revenue mix
│   │   ├── Leaderboard.tsx      # Student rankings
│   │   └── SensorStatus.tsx     # IoT bin status
│   └── layout/            # Header, Footer
├── lib/
│   ├── data.ts            # Google Sheets data fetching
│   └── utils.ts           # Formatting utilities
└── types/
    └── index.ts           # TypeScript interfaces
```

## Customization

### Colors
Edit `tailwind.config.js` to change the color palette:
- `cap` — Primary green (environmental)
- `earth` — Secondary brown/orange (materials)

### Metrics Targets
Edit `src/lib/utils.ts` → `TARGETS` object to adjust semester goals.

### Adding New Charts
1. Create component in `src/components/dashboard/`
2. Import and use in `src/app/page.tsx`
3. Add data fetching in `src/lib/data.ts`

## Data Pipeline

```
[IR Sensor on Box] → [ESP32] → POST JSON → [Google Apps Script Webhook]
                                    → Appends to "Sensor Data Log" tab
                                    → Impact Dashboard formulas update
                                    → Dashboard fetches CSV → Displays
```

See `16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md` and `resources/sensor_count.ino` for sensor setup.

## Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production (static export)
npm run start    # Preview production build
npm run lint     # Run ESLint
```

## Data Backends

This dashboard reads from **Google Sheets** (via published CSV). The optional
Supabase path (realtime IoT) lives in `web/supabase_dashboard/` and the firmware
in `firmware/` — use that for the Center tier; the two are independent.

## Tech Stack

- **Framework:** Next.js 14 (App Router, Static Export)
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Language:** TypeScript
- **Deployment:** Vercel (static hosting)

## License

MIT — Open source for schools worldwide. See `LICENSE` in main kit.

## Support

- 📖 [Full Implementation Kit](../README.md)
- 💬 [Discord Community](https://discord.gg/capcollective)
- 🐛 [GitHub Issues](https://github.com/capcollective/dashboard/issues)
- 📧 hello@capcollective.org
