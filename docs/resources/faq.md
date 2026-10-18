---
title: FAQ & Troubleshooting
---

# FAQ & Troubleshooting

Common questions and solutions from schools running Cap Collective.

---

## Common Issues

| Problem | Solution |
|---------|----------|
| **Uneven sheets** | Check flake size (5-8mm), press temp, parchment quality |
| **Burn marks** | Lower temp 5°C, reduce time, check parchment |
| **Shredder jams** | Reverse, clear with stick (never hands!), oil blades |
| **Sensor not posting** | Check WiFi, webhook URL, Apps Script "Anyone" access |
| **Low participation** | Gamify! Badges, class competitions, leaderboard |
| **Grant rejected** | Get feedback, strengthen data, resubmit |

---

## Frequently Asked Questions

### Materials & Process

**Q: Can we use other plastics (PP, LDPE)?**
A: Yes, but separate by type. PP melts at 170°C. Never mix types in one batch.

**Q: What if we don't have a laser cutter?**
A: Hand-cut with scissors/utility knife, or use pre-cut templates. Coasters work great as squares.

**Q: Can products go back into the system?**
A: Yes! That's the circular loop. Failed coasters → re-shred → re-press.

**Q: What about PET (#1) bottles?**
A: No. PET melts at 260°C (too high for school equipment) and releases different fumes. Stick to HDPE #2 and PP #5 caps.

**Q: How many caps per product?**
A: Coaster ≈ 15 caps, Keychain ≈ 4 caps, Organizer ≈ 30 caps, Tile ≈ 50 caps.

---

### Equipment & Safety

**Q: How many students per machine?**
A: 1 certified adult per 4 students at heat press/shredder. Laser: 1:2.

**Q: What's the minimum age for machines?**
A: Heat press & shredder: 14+ (certified). Laser: 16+. No exceptions.

**Q: Can we use a kitchen oven instead of a heat press?**
A: No. No temperature control, no pressure, no safety features. Not allowed.

**Q: What ventilation do we need?**
A: Minimum 100 CFM exhaust fan. Fume hood recommended. Window alone is not enough.

**Q: What PPE is required?**
A: Goggles (ANSI Z87.1), heat gloves (500°F rated), N95+ respirator, closed-toe shoes, hair tied back.

---

### Data & Dashboard

**Q: Do we need IoT sensors?**
A: No. Manual entry to Google Sheets works perfectly. Sensors are optional (FabLab+).

**Q: How do we set up the dashboard?**
A: See [Dashboard Deployment](../technical/dashboard.md) — fork repo, create Supabase, deploy to Vercel.

**Q: Can we use Excel instead of Google Sheets?**
A: Yes, CSV files import into Excel. Formulas may need adjustment.

**Q: How often should we update the dashboard?**
A: After every collection (daily/weekly). Students love seeing real-time updates.

---

### Funding & Grants

**Q: How much does it cost to start?**
A: Core tier: $500-1,000. Many schools start with PTA grant + DonorsChoose.

**Q: Which grants work best?**
A: Local foundations, PTA, DonorsChoose, Erasmus+ (EU), STEM grants from utilities.

**Q: When do we break even?**
A: Typically semester 2. Coasters at $10/set, 70% margin = $7 profit/set.

---

### Scaling & Handover

**Q: How do we hand off to next year's students?**
A: Use [Continuity Guide](../scaling/continuity.md) — outgoing leads train incoming leads.

**Q: Can we expand to other schools?**
A: Yes! Hub-and-spoke model. See [District Scaling](../scaling/district.md).

**Q: What if our teacher lead leaves?**
A: Document everything in Command Center. Train 2+ teacher champions. Use [Handover Checklist](../scaling/continuity.md).

---

## Quick Reference Cards

Print and post at each station:

### Heat Press Card
```
TEMP: HDPE 140°C | PP 170°C | MAX 200°C
TIME: 5 min + flip + 5 min
PARCHMENT: Top + bottom (mandatory)
COOL: 10 min before handling
QC: Thickness ±0.5mm
```

### Shredder Card
```
FEED: Slow, steady, one handful
SIEVE: 5-8mm only (discard fines)
OIL: Weekly (shredder oil sheets)
JAM: REVERSE → STOP → Clear with stick
```

### Collection Card
```
ACCEPT: HDPE #2 caps (milk, water, soda)
REJECT: PET #1 bottles, metal, dirty caps
LINERS: Remove ALL (soak 10 min if stuck)
DRY: 24 hrs minimum on mesh rack
```

---

## Still Stuck?

- **Discord:** [discord.gg/MpYwN3Kyg](https://discord.gg/MpYwN3Kyg) — 50+ teachers online
- **GitHub Issues:** [Report bugs](https://github.com/imredavid64-glitch/capcollective/issues)
- **Email:** support@capcollective.org
- **Office Hours:** First Tuesday, 4pm ET