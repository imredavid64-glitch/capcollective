# Cap Collective School Launch Deck
## Presentation Content for Google Slides
**Total Slides: ~30 | Audience: Administrators, Teachers, Students, Parents, Community Partners**
**Three Presentation Tracks: K-5, 6-8, 9-12 (hide/show slides per audience)**

---

## SLIDE 1: TITLE SLIDE
**Cap Collective: Building a Circular Economy in Schools**
*Subtitle: From Bottle Caps to Community Impact — A Student-Led Innovation Program*
**Presenter Notes:** Welcome everyone. Today we're presenting Cap Collective — a complete, scalable K-12 program where students turn plastic waste into valuable products while learning STEM, entrepreneurship, and environmental stewardship.

---

## SLIDE 2: THE PROBLEM — VISUAL IMPACT
**One Image, One Statistic**
- **Visual:** Photo of marine life affected by bottle caps OR local school litter
- **Stat:** "Only 3% of bottle caps are recycled globally. 60 billion caps produced annually in the US alone."
- **Caption:** "The distance between an idea and its impact is the bridge we build today."
**Presenter Notes:** This isn't a distant problem. It's in our cafeteria, our playground, our community. Bottle caps are among the top 5 deadliest marine debris items — small, colorful, mistaken for food.

---

## SLIDE 3: WHY BOTTLE CAPS? (K-5 Track)
**The "Cap Detectives" Mission**
- Caps are made of **HDPE (Plastic #2)** — different from bottles (PET #1)
- Too small for big recycling machines → they fall through the cracks
- **But:** Clean caps = high-value material we can use RIGHT HERE
- **Analogy:** Like sorting Legos by color before building

---

## SLIDE 4: WHY BOTTLE CAPS? (6-12 Track)
**Material Science & Systems Thinking**
| Property | Bottle (PET #1) | Cap (HDPE #2 / PP #5) |
|----------|-----------------|----------------------|
| Density | 1.38 g/cm³ | 0.95 g/cm³ (floats!) |
| Melting Point | 260°C | 130-160°C |
| Industrial Sorting | Optical sorters catch it | **Falls through trommels** |
| Market Value (recycled) | $300-400/ton | **$500-800/ton** |
**Key Insight:** Source separation at school captures value that industrial systems lose.

---

## SLIDE 5: THE BRIDGE METAPHOR
**Intent → Action → Impact**
```
[Student wants to help] → [Drops cap in box] → [IR sensor counts it]
                                                    ↓
[Dashboard shows progress] ← [Data uploaded] ← [Weekly collection]
                                                    ↓
[Caps washed & shredded] → [Heat press → sheets] → [Laser cut products]
                                                    ↓
[School store sales] → [Funds garden/grants] → [Cycle repeats]
```
**Presenter Notes:** Every step is visible, measurable, and student-run. This is the "Bridge."

---

## SLIDE 6: THE SOLUTION — COLLECTION BOXES (K-5)
**Build Your Own Cap Collector**
- Laser-cut wood design (files in `cad/collection_box.scad` — export to DXF)
- Clear acrylic front — see the caps pile up!
- IR sensor slot for auto-counting
- **Class Activity:** "Box Building Day" — sand, glue, assemble
- **Cost:** ~$15-25 per box in materials

---

## SLIDE 7: THE SOLUTION — COLLECTION SYSTEM (6-12)
**Zone Mapping & Deployment Strategy**
1. **Audit:** Map high-traffic zones (cafeteria, gym, entry, library)
2. **Deploy:** 1 box per 150 students minimum
3. **Brand:** Student-designed signage ("Feed the Box!")
4. **Tech:** ESP32 + IR beam-break sensor → WiFi → Dashboard
5. **Schedule:** Student "Green Team" collects Fridays, weighs, logs

---

## SLIDE 8: THE TRANSFORMATION CYCLE — OVERVIEW
**5 Steps: Collect → Clean → Shred → Melt → Refine**
```
STEP 1: COLLECT     →  Source-separated HDPE/PP caps
STEP 2: CLEAN       →  Warm soapy water, remove liners, dry 24hrs
STEP 3: SHRED       →  5-8mm uniform flakes (critical for quality)
STEP 4: MELT        →  Heat press 140°C (HDPE) / 170°C (PP) — parchment sandwich
STEP 5: REFINE      →  Laser cut / injection mold / 3D print filament
```
**Presenter Notes:** Each step has a student role. Safety protocols at every stage.

---

## SLIDE 9: EQUIPMENT TIERS — CHOOSE YOUR STARTING POINT
| Tier | Cost | Equipment | Best For |
|------|------|-----------|----------|
| **Core** | $500-1,000 | Budget heat press, hand tools, PPE, DIY boxes, basic shredder | Primary schools, clubs, pilots |
| **FabLab** | $2,500-5,000 | Auto-open press, 3D printer (Bambu/Prusa), Arduino sensors, GDPR shredder, basic CNC | Middle/High, makerspaces |
| **Center** | $10,000+ | Premium press, injection molder, Trotec laser, precision molds, ventilation | Tech schools, district hubs |

**Presenter Notes:** Start Core. Scale up. Every tier produces real products.

---

## SLIDE 10: WHAT STUDENTS MAKE — PRODUCT LINE
**Real Products, Real Value**
| Product | Grade Band | Tools Needed | Sell Price | Margin |
|---------|------------|--------------|------------|--------|
| Coasters (set of 4) | K-12 | Heat press, laser | $8-12 | 70% |
| Desk Organizers | 3-12 | Heat press, laser | $12-18 | 65% |
| Plant Pot / Seedling Tray | K-8 | Injection molder | $5-8 | 75% |
| Keychains / Badges | 3-12 | Injection molder | $3-5 | 80% |
| Outdoor Tiles (12×12") | 6-12 | Heat press, large mold | $15-25 | 60% |
| 3D Printer Filament (1kg) | 9-12 | Filament extruder | $20-30 | 50% |
| Custom School Signage | 9-12 | Laser cutter | $25-50 | 55% |

**Visual:** Photos of each product (use Instructables examples)

---

## SLIDE 11: CURRICULUM INTEGRATION — NOT AN ADD-ON
**Mapped to Standards (NGSS, IB, Common Core, State)**
| Subject | K-2 | 3-5 | 6-8 | 9-12 |
|---------|-----|-----|-----|------|
| **Science** | Properties of materials, recycling | States of matter, pollution | Chemical recycling, LCA | Polymer chemistry, circular economy |
| **Math** | Counting, sorting, graphing | Measurement, fractions, area | Statistics, optimization | Calculus (extrusion rates), econ |
| **CS/Tech** | Tablet data entry | Google Forms, charts | Arduino, dashboards, Fusion 360 | Python, API, CNC, AI prediction |
| **Art/Design** | Decorate coasters | Tinkercad design | Product design, branding | Industrial design, UX |
| **Business** | Class store simulation | Pricing, profit/loss | Business plan, marketing | Supply chain, grants, B2B sales |

---

## SLIDE 12: GRADE-BAND PROGRAMS — K-2 "CAP DETECTIVES"
**Focus: Observation, Sorting, Storytelling**
- **Weekly:** Cap hunt → sort by color → count → graph
- **Story:** "Cap's Journey" — picture book from bottle to coaster
- **Product:** Decorate pre-made coasters (markers, stickers)
- **Tech:** Teacher enters data on tablet (picture-based)
- **Outcome:** "I can identify HDPE!" badge

---

## SLIDE 13: GRADE-BAND PROGRAMS — 3-5 "CAP ENGINEERS"
**Focus: Process, Measurement, Design**
- **Build:** Laser-cut collection boxes (assembly)
- **Process:** Wash → shred (supervised) → press sheets
- **Design:** Tinkercad → coaster designs → laser cut
- **Math:** Weigh flakes, calculate yield %, graph collection
- **Product:** Coasters, simple injection keychains

---

## SLIDE 14: GRADE-BAND PROGRAMS — 6-8 "CAP INNOVATORS"
**Focus: Data, Product Dev, Entrepreneurship**
- **Sensors:** Program Arduino/ESP32 IR counters
- **Dashboard:** Build Google Sheets/Looker Studio dashboards
- **Design:** Fusion 360 → 3D print molds → injection mold
- **Biz:** Cost analysis, pricing, school store management
- **Product:** Full line + custom orders for events

---

## SLIDE 15: GRADE-BAND PROGRAMS — 9-12 "CAP SYSTEMS DESIGNERS"
**Focus: Systems Engineering, Policy, Scale**
- **LCA:** Life Cycle Assessment of recycled vs virgin plastic
- **R&D:** Test PP, LDPE, mixed streams; new mold designs
- **Scale:** Supply chain optimization, grant writing
- **Tech:** Python data analysis, API integration, CNC mold making
- **Product:** Architectural tiles, furniture components, B2B orders

---

## SLIDE 16: TECHNOLOGY INTEGRATION — LIVE DATA
**Sensor → Dashboard → Action**
- **Hardware:** ESP32 + IR beam-break sensor ($8) per box
- **Data Flow:** Box → WiFi → Google Sheets / Vercel dashboard
- **Features:** Real-time count, fill-level alerts, weekly trends, class leaderboards
- **Student Role:** "Data Analyst" — maintains dashboard, finds insights
- **Gamification:** Class competitions, school-wide goals, public dashboard

---

## SLIDE 17: SAFETY FIRST — NON-NEGOTIABLE
**Every Tier, Every Grade**
✅ **Ventilation:** Active exhaust (100+ CFM) or fume hood — MANDATORY
✅ **PPE:** Heat-resistant gloves (500°F), safety goggles, VOC respirators (N95+)
✅ **Temperature:** IR thermometer verify 140-180°C — NEVER exceed 200°C
✅ **Training:** Student certification before machine access (signed log)
✅ **Supervision:** 1 certified adult per 4 students at machines
✅ **Emergency:** Fire blanket, extinguisher, first aid, evacuation plan posted

---

## SLIDE 18: 18-WEEK IMPLEMENTATION TIMELINE
| Phase | Weeks | Key Activities | Milestone |
|-------|-------|----------------|-----------|
| **Launch** | 1-2 | Admin MOU, space prep, equipment order, student leads | Signed agreement, orders placed |
| **Build** | 3-4 | Build boxes, install sensors, safety certs, first collection | 5+ boxes live, dashboard active |
| **Process** | 5-8 | Weekly cycles: collect→wash→shred→press→finish | 500+ caps, first batch products |
| **Product** | 9-12 | Design sprint, mold making, QC, branding, packaging | 3+ product lines ready to sell |
| **Market** | 13-15 | Eco-store launch, community sale, impact report v1 | $500+ revenue, public report |
| **Scale** | 16-18 | Reflection, documentation, train next cohort, grant apps | Handoff guide, grant submitted |

---

## SLIDE 19: MEASURABLE IMPACT GOALS (Per Semester)
| Metric | Baseline | Target | Measurement |
|--------|----------|--------|-------------|
| Caps Collected | ~1,000 | **10,000+** | Sensor + manual audit |
| Waste Diverted | ~3 kg | **35+ kg** | Weight logs |
| Economic Value | $5 | **$250+** | Product revenue |
| Student Participation | 5% | **80%** | Role sign-ups + hours |
| CO₂e Avoided | ~1 kg | **15+ kg** | EPA WARM model |

**Presenter Notes:** These are conservative. Pilot schools hit 10k caps in 8 weeks.

---

## SLIDE 20: BUDGET & FUNDING SOURCES
**Start-Up Capital Options**
| Source | Typical Amount | Timeline | Effort |
|--------|----------------|----------|--------|
| PTA / Parent Org | $500-2,000 | 2-4 weeks | Low |
| School Budget (STEM/Art) | $1,000-5,000 | 1-3 months | Medium |
| Local Business Sponsorship | $500-3,000 | 4-8 weeks | Medium |
| **Grants (see templates)** | **$2,000-25,000** | **2-6 months** | **High** |
| Product Pre-sales | $200-1,000 | 4-6 weeks | Low |
| Crowdfunding (DonorsChoose) | $500-3,000 | 3-8 weeks | Medium |

---

## SLIDE 21: GRANT-READY NARRATIVE (Copy-Paste Ready)
**"Cap Collective establishes a student-run circular manufacturing program that diverts HDPE waste from landfills while teaching NGSS-aligned STEM, entrepreneurship, and data science. Year 1: 10,000+ caps diverted, 50+ students certified, $500+ revenue reinvested in school garden. Scalable to district-wide."**

**Included in Kit:** 4 grant templates (General Foundation, Erasmus+, Corporate Sponsorship, Crowdfunding) + 5 outreach scripts

---

## SLIDE 22: COMMUNITY ECOSYSTEM
**The Circular Loop Extends Beyond School**
```
[Local Cafés] → donate caps → [School Processes] → [Coasters/Products] → [Return to Cafés]
                                                    ↓
[Community Events] ← [School Store Sales] ← [Funds: Garden, Grants, Scholarships]
                                                    ↓
[District Partners] ← [Curriculum Sharing] ← [Open-Source Kit] → [Global Network]
```

---

## SLIDE 23: TEACHER SUPPORT — WE'RE WITH YOU
**Professional Development Included**
- **2-hour virtual launch workshop** (recorded)
- **Monthly office hours** (first Tuesday, 4pm)
- **Slack/Discord community** — 50+ teachers globally
- **Lesson plans ready Day 1** — zero prep for first month
- **Substitute-friendly** — video demos for every machine operation

---

## SLIDE 24: IMPLEMENTATION CHECKLIST — ADMIN VIEW
**☐ 1. Designate Program Lead (stipend recommended)**
**☐ 2. Identify Space:** Ventilated room, 16A power, sink access
**☐ 3. Select Budget Tier & Approve PO**
**☐ 4. Sign Safety MOU** (included in kit)
**☐ 5. Recruit Student Leads** (application form included)
**☐ 6. Schedule PD** (before equipment arrives)
**☐ 7. Launch Week Plan** (assembly, box building, first collection)

---

## SLIDE 25: IMPLEMENTATION CHECKLIST — TEACHER VIEW
**☐ 1. Review Teacher Guide Chapters 1-3**
**☐ 2. Complete Safety Certification** (2-hour online module)
**☐ 3. Map Collection Zones** with students
**☐ 4. Build First Box** (class activity)
**☐ 5. Set Up Dashboard** (see `16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md`)
**☐ 6. Run Week 1 Collection** (celebrate first 100 caps!)
**☐ 7. Schedule Curriculum Blocks** (double periods recommended)

---

## SLIDE 26: STUDENT LEADERSHIP STRUCTURE
**Roles Rotate Quarterly — Every Student Leads**
| Role | Responsibility | Certification | Grades |
|------|----------------|---------------|--------|
| **Collection Captain** | Zone mapping, box monitoring, Friday pickup | Safety + Data Entry | 3+ |
| **Wash Station Lead** | Cleaning protocol, liner removal, drying logs | Hygiene + Material ID | 3+ |
| **Shredder Operator** | Feeding, sieving, flake quality check | Shredder Safety (14+) | 6+ |
| **Press Operator** | Temp monitoring, parchment sandwich, timing | Heat Press Safety (14+) | 6+ |
| **Design Engineer** | Fusion 360/Tinkercad, mold design, QC | Design Software | 6+ |
| **Data Analyst** | Dashboard maintenance, trend reports, alerts | Sheets/Arduino | 6+ |
| **Business Manager** | Inventory, pricing, sales, marketing | Financial Literacy | 9+ |

---

## SLIDE 27: QUALITY CONTROL — STUDENT-LED
**Every Product Meets Standards**
```
QC CHECKLIST (student-signed per batch):
☐ Flake size uniform (5-8mm sieve test)
☐ Sheet thickness ±0.5mm (caliper check)
☐ No burn marks / discoloration
☐ Edges sanded smooth (no sharp edges)
☐ Dimensions match spec (±1mm)
☐ Branding stamp applied
☐ Batch logged: date, operators, material %, weight
```
**Failed batch?** → Re-shred → Re-press → Learn → Document

---

## SLIDE 28: FIRST-YEAR SUCCESS METRICS
**What "Good" Looks Like**
- ✅ 10+ schools implementing (district or network)
- ✅ 100,000+ caps diverted from landfill
- ✅ 500+ students directly engaged (certified roles)
- ✅ $5,000+ product revenue reinvested
- ✅ 3+ grant applications submitted
- ✅ Curriculum adopted by 2+ districts
- ✅ Open-source kit downloaded 500+ times

---

## SLIDE 29: NEXT STEPS — YOUR ACTION PLAN
**This Week:**
1. **Share this deck** with admin/STEM lead
2. **Schedule 30-min discovery call** (Calendly link)
3. **Identify your space & budget tier**
4. **Nominate 2 Teacher Champions**

**Next Month:**
5. Submit PO / Grant application
6. Receive equipment → Safety PD
7. Student applications → Team formation
8. **LAUNCH WEEK!**

---

## SLIDE 30: JOIN THE MOVEMENT
**Cap Collective is Open Source. Global. Student-Led.**
- **Website:** capcollective.vercel.app (live dashboards)
- **Tracker:** bottle-cap-tracker.vercel.app (real-time data)
- **Instructables:** 12-step build guide
- **Community:** Discord / Slack (invite on request)
- **Contact:** [email] | [phone] | QR Code to calendar

**Final Quote:** *"Don't just watch the bridge being built. Cross it with us."*

---

## APPENDIX SLIDES (Hidden by Default — Show on Request)
- **A1:** Full Equipment Specs & Regional Suppliers
- **A2:** Risk Assessment Template (completed example)
- **A3:** Grant Application Templates (3 versions)
- **A4:** Parent Communication Templates (email, newsletter, permission slip)
- **A5:** Standards Alignment Tables (NGSS, IB, State, Common Core)
- **A6:** Troubleshooting FAQ (20 common issues)
- **A7:** Student Application Forms & Role Descriptions
- **A8:** Product Catalog with Pricing & Cost Breakdowns

---

## SPEAKER NOTES MASTER DOCUMENT
*See separate file: `LAUNCH_DECK_SPEAKER_NOTES.md` for detailed talking points, anticipated questions, and demo scripts for each slide.*
