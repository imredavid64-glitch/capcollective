# FAQ & Troubleshooting

Frequently asked questions and solutions for Cap Collective operations.

---

## Getting Started

### Q: How much does it cost to start?
**A:** Three budget tiers:
- **Core:** $500-1,000 (press, hand tools, PPE, manual shredder)
- **FabLab:** $2,500-5,000 (auto press, 3D printer, sensors, GDPR shredder)
- **Center:** $10,000+ (injection molder, laser, CNC, ventilation)

Start Core. Scale up. Every tier produces real products.

### Q: Do I need a dedicated room?
**A:** Minimum 200 sq ft with:
- Exterior wall for ventilation (100+ CFM exhaust)
- 16A dedicated circuit (press)
- Sink access (wash station)
- Fire extinguisher + blanket + first aid

### Q: What grades can participate?
**A:** K-12 with differentiated roles:
- **K-2:** Cap Detectives (sort, count, decorate)
- **3-5:** Cap Engineers (build boxes, wash/shred supervised, Tinkercad)
- **6-8:** Cap Innovators (Arduino, Fusion 360, business plan)
- **9-12:** Systems Designers (LCA, CNC, grants, B2B)

### Q: How long before we make products?
**A:** Typical timeline:
- Weeks 1-2: Approvals, equipment arrival, safety certs
- Weeks 3-4: Box building, first collection, wash/shred demo
- Weeks 5-8: First sheets pressed, first coasters cut
- Week 9+: Product sales, eco-store launch

---

## Equipment & Operations

### Q: What plastic caps work?
**A:** Only HDPE #2 and PP #5:
- ✅ Milk jug caps (HDPE #2)
- ✅ Water bottle caps (HDPE #2)
- ✅ Detergent caps (HDPE #2)
- ✅ Yogurt cups (PP #5)
- ✅ Ketchup/mayo caps (PP #5)
- ✅ Medicine bottle caps (PP #5)
- ❌ PET #1 bottles (sinks, different melt)
- ❌ Metal caps
- ❌ Caps with liners still in
- ❌ Dirty/contaminated caps

### Q: How do I identify HDPE vs PP?
**A:** 
- **Float test:** HDPE floats in water, PP sinks (barely)
- **Look for symbol:** #2 = HDPE, #5 = PP
- **Feel:** HDPE softer, PP more rigid
- **Burn test (teachers only):** HDPE = candle wax smell, PP = diesel smell

### Q: What temperature for pressing?
**A:** 
- **HDPE:** 140°C (284°F) — 5 min + flip + 5 min
- **PP:** 170°C (338°F) — 4 min + flip + 4 min
- **MAX:** 200°C (NEVER EXCEED)
- **Always verify with IR thermometer**

### Q: Why do my sheets warp?
**A:** Common causes:
- Not cooling under weight (10 min minimum)
- Uneven flake distribution
- Parchment not clean/flat
- Temp too high / time too long
- Removed before fully cool

**Fix:** Cool 10+ min under flat weight (steel plate works)

### Q: Why are my sheets burnt/discolored?
**A:** 
- Temp too high → Lower 5-10°C
- Time too long → Reduce 1 min per side
- Parchment reused too many times → Fresh parchment
- Flakes too thick → Spread thinner (~3mm)

### Q: Why do my coasters crack/break?
**A:**
- Sheet too thin (<2.5mm) → Press thicker
- Edges not sanded → Sand all edges
- Material too brittle (old/oxidized flakes) → Fresher flakes
- Design has sharp internal corners → Add 0.5mm fillets

### Q: Shredder keeps jamming. Help!
**A:**
1. **REVERSE → STOP → WAIT 30 SEC** → Clear with stick (NEVER hands)
2. Feed slower, one handful at a time
3. Check sieve: 5-8mm only (no fines, no chunks)
4. Oil blades weekly (shredder oil sheets)
5. Check for metal contamination (magnet on input)

### Q: Laser cuts are messy/burnt.
**A:**
- **Focus test first** (ramp test or material test)
- **Air assist ON** (mandatory for HDPE)
- **Settings for 3mm HDPE (60W CO2):** 60% power, 20mm/s, 2 passes
- **Frame check** before every cut
- **Watch ENTIRE cut** — never leave
- **30 sec wait** after cut before opening

### Q: Sensor not sending data.
**A:**
1. Check WiFi credentials (2.4GHz only!)
2. Verify Apps Script URL (redeploy as "Anyone")
3. Check Serial Monitor for error codes
4. Verify bin_id matches Command Center
5. Check GPIO pin matches code (default 27)
6. Restart ESP32 (power cycle)

---

## Safety & Compliance

### Q: What PPE is required?
**A:** Per station:
| Station | Goggles | Heat Gloves | N95+ | Apron | Ear Pro |
|---------|---------|-------------|------|-------|---------|
| Wash | ✅ | ❌ | ❌ | ✅ | ❌ |
| Shredder | ✅ | ❌ | ✅ | ✅ | ✅ |
| Press | ✅ | ✅ 500°F | ✅ | ✅ | ❌ |
| Laser | ✅ | ❌ | ✅ | ✅ | ❌ |
| Injection | ✅ | ✅ 500°F | ✅ | ✅ | ❌ |

### Q: What age for machines?
**A:**
- **Shredder/Press/Laser/Injection:** 14+ with certification
- **CNC:** 16+ with certification
- **3D Printer:** 12+ with supervision
- **Wash/Wash/Sort:** Any age (with supervision)

### Q: Do students need parental consent?
**A:** Yes. Forms required:
1. Program Consent (all activities)
2. Safety Pledge (student signed)
3. Photo/Video Release (opt-out available)
4. Medical Info (confidential)
5. Machine-specific consent (for 14+ machines)

### Q: What insurance do we need?
**A:** Typically covered under school general liability. Verify:
- [ ] Student activities endorsement
- [ ] Equipment coverage
- [ ] Product liability (for sales)
- [ ] Volunteer coverage
- [ ] Field trip/event endorsement

### Q: What about fumes?
**A:** 
- HDPE/PP at 140-170°C = minimal fumes (below degradation temp)
- **Never exceed 200°C** (degradation starts ~250°C)
- **Ventilation mandatory:** 100+ CFM at press
- **N95+ required** at press/shredder/laser
- **CO2 monitor** recommended (alert >1000 ppm)

---

## Data & Dashboard

### Q: How does the dashboard work?
**A:** Two options:
- **Option A (Sheets + Looker):** Free, 15-min refresh, no code
- **Option B (Supabase + Next.js):** Real-time, custom, CS project
- **Option C (HTML/JS + Supabase):** Real-time, no build

### Q: How do I connect sensors to Google Sheets?
**A:** 
1. ESP32 + FC-51 sensor → WiFi → Apps Script webhook
2. Apps Script → appends to "Sensor Data Log" tab
3. Formulas in "Impact Dashboard" tab auto-calculate
5. Looker Studio connects to Sheet → charts

### Q: Can I use the dashboard without sensors?
**A:** Yes! Manual entry in Collection Tracker tab works perfectly. Sensors just automate counting.

### Q: How do I publish the Command Center as CSV?
**A:** File → Share → Publish to web → Select tab → CSV → Copy URL → Use in dashboard config

### Q: Dashboard shows old data.
**A:** 
- Google Sheets caches (open sheet to refresh)
- Looker: Refresh data source or wait 15 min
- Supabase: Check realtime subscription active
- Check sensor battery/WiFi

---

## Products & Sales

### Q: What products sell best?
**A:** Ranked by margin × velocity:
1. **Coaster 4-pack** — $12, 70% margin, high volume
2. **Keychains** — $4, 80% margin, impulse buy
3. **Desk Organizers** — $18, 65% margin, gift market
4. **Keychain/Badge** — $3-5, 80% margin, events
5. **Outdoor Tiles** — $25, 60% margin, B2B

### Q: How do I price products?
**A:** Formula: `(Material + Energy + Packaging) ÷ (1 - Target Margin)`
- Target 65-70% margin
- Include: flakes, parchment, energy, packaging, labor ($0 student)
- Round to psychological price ($12 not $11.99)

### Q: Can we sell online?
**A:** Yes, with compliance:
- **Shopify/Etsy:** Marketplace facilitator collects sales tax
- **Local pickup only** (sustainability — no shipping plastic)
- **Digital products:** Curriculum packs, design files (100% margin)
- **Compliance:** Sales tax nexus, business license (usually under school/PTA)

### Q: How do we handle cash?
**A:** 
- Square Reader (2.6% + $0.10) — auto-syncs to dashboard
- Cash box: $50 float ($20 ones, $10 fives, $20 change)
- **Dual count:** 2 students + teacher verify open/close
- Daily deposit log in Command Center Tab 3

### Q: What if a product fails QC?
**A:** 
1. Document: photo + batch # + failure mode
2. Root cause (5 Whys)
3. Re-shred → Re-press → Re-test
4. Log in Command Center (failed batch = learning)
5. Update process doc

---

## Grants & Funding

### Q: Where do I find grants?
**A:** 
- **Foundation Directory Online** (Candid)
- **GrantWatch, GrantStation**
- **Local community foundation**
- **Corporate foundations** (local HQ)
- **DonorsChoose** (crowdfunding for teachers)
- **State Dept of Education** (STEM grants)

### Q: What makes a strong application?
**A:** 
- **Narrative:** "Student-run circular manufacturing diverting 10K caps/yr"
- **Metrics:** Baseline → Target (caps, kg, CO2e, students, revenue)
- **Sustainability:** Revenue covers consumables Year 2+
- **Scalability:** Open-source, district replication plan
- **Student voice:** Testimonials, photos, data

### Q: Can product revenue fund the program?
**A:** Yes! Typical Year 1:
- $500-2,000 revenue
- Covers: parchment, molds, PPE, filament
- Reinvest: new molds, equipment upgrades, garden
- **Key:** Reinvest 100% → compounding growth

---

## Troubleshooting Quick Reference

| Symptom | Likely Cause | Quick Fix |
|---------|--------------|-----------|
| Sheets warp | Cool time / weight | 10 min + steel plate |
| Burn marks | Temp / time / parchment | -5°C, -1 min, fresh paper |
| Uneven melt | Flake size / spread | Sieve 5-8mm, spread even |
| Shredder jam | Feed rate / debris | Reverse→Stop→Stick |
| Sensor offline | WiFi / webhook / power | Reboot, check creds |
| No data in dashboard | Sheets not published | Publish to web → CSV |
| Low sales | Price / visibility | Promo, bundle, relocate |
| Contamination | Liners / dirt | Longer soak, better sort |
| Warped mold | Cool too fast / no vent | Slow cool, add vents |
| Flash on parts | Pressure high / temp high | Lower pressure/temp |

---

## Escalation Path

| Issue Level | Contact | Response Time |
|-------------|---------|---------------|
| **Safety Emergency** | 911 → Nurse → Principal | Immediate |
| **Machine Down (Press)** | District Tech → Vendor | 4 hrs / 24 hrs |
| **Sensor Network Down** | Data Analyst → District IT | 1 hr / 4 hrs |
| **Grant Deadline** | Grant Lead → District Office | 24 hrs |
| **Safety Concern** | Safety Officer → Principal | Immediate |
| **Student Injury** | Nurse → Parents → Principal → District | Immediate |
| **Budget Overrun** | Business Mgr → Principal → Finance | 48 hrs |
| **Vendor Issue** | Procurement → Vendor | 24 hrs |

---

## Still Stuck?

### Community Support
- **Discord:** [discord.gg/capcollective](https://discord.gg/capcollective) — 50+ teachers
- **Office Hours:** First Tuesday, 4pm ET
- **GitHub Issues:** [Report bugs](https://github.com/imredavid64-glitch/capcollective/issues)
- **Email:** support@capcollective.org

### Before Asking, Include:
1. **Tier:** Core / FabLab / Center
2. **Equipment:** Model + specs
3. **Error:** Exact message / behavior
4. **Tried:** What you've already attempted
5. **Photos:** Of setup, error, results
6. **Data:** Relevant Command Center screenshots