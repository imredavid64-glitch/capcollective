# Quick Start Guide

Get Cap Collective running in your school in 5 steps.

---

## Step 1: Pitch & Approve (Week 0)

| Audience | Document | Time |
|----------|----------|------|
| Admin | [Launch Deck](https://github.com/imredavid64-glitch/capcollective/blob/main/01_LAUNCH_DECK_PRESENTATION.md) (Slides 1-24) | 30 min |
| Admin | [Admin Quick-Start Checklist](admin-checklist.md) | 10 min |
| Admin | [School Buy-In Playbook](https://github.com/imredavid64-glitch/capcollective/blob/main/12_SCHOOL_BUYIN_AND_APPROVAL_PLAYBOOK.md) | 2 hrs |
| Finance | [Procurement & Finance Playbook](https://github.com/imredavid64-glitch/capcollective/blob/main/13_PROCUREMENT_PAYMENT_AND_FINANCE_PLAYBOOK.md) | 1 hr |

**Deliverables:** Signed MOU, approved budget tier, designated Program Lead, space confirmed.

---

## Step 2: Order Equipment (Week 1)

### Choose Your Tier

| Tier | Cost | Key Equipment | Lead Time |
|------|------|---------------|-----------|
| **Core** | $500–1,000 | Budget press, hand tools, PPE, manual shredder | 1-2 weeks |
| **FabLab** | $2,500–5,000 | Auto press, 3D printer, sensors, GDPR shredder | 2-4 weeks |
| **Center** | $10,000+ | Injection molder, laser, precision molds | 6-8 weeks |

Use the [Equipment Procurement Planner](https://github.com/imredavid64-glitch/capcollective/blob/main/03_COMMAND_CENTER_SHEETS.md#tab-2-%F0%9F%92%92-equipment-procurement-planner) (Tab 2) + [Supplier Directory](resources/suppliers.md).

---

## Step 3: Safety Certification (Week 2)

**Before any student touches a machine:**

1. Read [Safety SOPs](https://github.com/imredavid64-glitch/capcollective/blob/main/04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md)
2. Complete [Certification Quizzes](https://github.com/imredavid64-glitch/capcollective/blob/main/17_CERTIFICATION_AND_TRAINING_PACK.md)
3. Practical demo with certified adult
4. Issue [Certification Cards](https://github.com/imredavid64-glitch/capcollective/blob/main/17_CERTIFICATION_AND_TRAINING_PACK.md#certification-cards)

**Rule:** No card = no machine access. Ever.

---

## Step 4: Build Command Center (Week 2-3)

### Option A: Google Sheets (Recommended)
1. Create new Sheet: **"Cap Collective Command Center"**
2. Add 8 tabs per [Command Center Guide](https://github.com/imredavid64-glitch/capcollective/blob/main/03_COMMAND_CENTER_SHEETS.md)
3. Import CSV files from `csv/` folder
4. Build 6 charts on Impact Dashboard tab
5. Set up Apps Script webhook for sensors (optional)

### Option B: Live Dashboard
1. Fork `cap-collective-dashboard` repo
2. Create Supabase project
3. Run [Supabase Schema](technical/supabase.md)
4. Deploy to Vercel (2 min)
5. Add env vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Step 5: Launch Week! (Week 3-4)

Follow the [Launch Week Run-of-Show](implementation/launch-week.md):

| Day | Focus | Key Activities |
|-----|-------|----------------|
| **Mon** | Kickoff | Assembly, box building, deploy boxes, dashboard live |
| **Tue** | Safety | Certification stations, first collection, role badges |
| **Wed** | Process | Wash → shred → press → cool → QC first sheet |
| **Thu** | Design | Laser cut coasters, student design sprint, pricing |
| **Fri** | Celebrate | Pop-up store, first sales, impact report, press release |

---

## Minimal Viable Launch (2 Weeks)

If you only have 2 weeks:

- [ ] Admin approval + budget tier chosen
- [ ] Safety MOU signed
- [ ] Core equipment ordered (press, shredder, PPE)
- [ ] 3 collection boxes built (DIY cardboard OK)
- [ ] Command Center created (Google Sheets)
- [ ] 4 student leads recruited + safety certified
- [ ] Launch assembly scheduled

---

## Need Help?

- **Discord:** [discord.gg/capcollective](https://discord.gg/capcollective) — 50+ teachers online
- **Office Hours:** First Tuesday, 4pm ET
- **Email:** support@capcollective.org
- **GitHub Issues:** [Report a problem](https://github.com/imredavid64-glitch/capcollective/issues)

---

!!! tip "Pro Tip"
    Start small. A single heat press + manual shredder + 3 boxes proves the concept. Scale up next semester.