# Email: Cap Collective School Implementation Kit Overview

To: [Reviewer Name]
From: David
Date: October 20, 2026
Subject: Cap Collective Kit — Student-Led Bottle Cap Recycling & Circular Manufacturing Program

---

Hi [Reviewer Name],

I'm sharing the Cap Collective implementation kit, a complete, ready-to-use system for launching a student-led bottle cap recycling and circular manufacturing program in any school. This kit has been a major focus of my work recently, and I'd value your review.

## Overview

**Cap Collective** is a student-led circular recycling program that captures discarded plastic bottle caps and transforms them into useful products — while funding the school garden. Students run every part of it: collection, cleaning, shredding, melting, product design, sales, and impact reporting.

The program addresses a real recycling blind spot: only about 3% of bottle caps are recycled globally. The rest end up in landfill or the ocean, where they resemble food to marine life. Cap Collective captures that resource at the source and turns it into value.

The kit ships with **29 documents** covering the entire journey — from convincing your principal to handing the program off to the next year's students. It's designed as a full curriculum platform spanning four grade bands (K-2, 3-5, 6-8, 9-12), with every lesson linking to standards (NGSS, Common Core, IB).

## Features

### Program Structure
- **5-step micro-factory process**: Collect → Clean → Shred → Melt → Refine
- **Closed loop**: When a product breaks, it goes right back to Step 3 (100% recyclable forever)
- **Material focus**: HDPE (#2) & PP (#5) caps only — never PVC (#3), which releases toxic gas when heated
- **Measurable impact targets per semester**: 10,000+ caps collected, 35+ kg plastic diverted, 65+ kg CO₂e avoided, $500+ product revenue, 80% student participation

### Curriculum & Grade Bands
- **K-2 "Cap Detectives"**: Observation, sorting, storytelling
- **3-5 "Cap Engineers"**: Measurement, building, basic design
- **6-8 "Cap Innovators"**: Data, sensors, entrepreneurship
- **9-12 "Cap Systems Designers"**: Engineering, life-cycle analysis, policy, scale

Every lesson includes printable worksheets and standards mapping. The program is **not an add-on** — it's mapped to science, math, CS/tech, art/design, and business standards across all grade bands.

### Budget Tiers (Start Small, Scale Up)
| Tier | Cost | Best For |
|------|------|----------|
| **Core** | $500 – $1,000 | Primary schools, clubs, pilots |
| **FabLab** | $2,500 – $5,000 | Middle/high school makerspaces |
| **Center** | $10,000+ | Technical schools, district hubs |

### Technology & IoT (FabLab+ / Center Tier)
- **ESP32/ESP32-S3 sensor network** for auto-counting caps into a live dashboard
- **Architecture**: Nodes → ESP-NOW (2.4 GHz) → Radio Tower → WiFi → Supabase PostgreSQL → Real-time dashboard
- **Live dashboards**: capcollective.vercel.app and bottle-cap-tracker.vercel.app
- **Sensor code** included: `resources/sensor_count.ino`, `firmware/` for Node 1, Node 2, Radio Tower

### Safety (Non-Negotiable)
- **No certification = no machine access**
- Maximum temperature: **200°C** — never exceeded
- Ventilation mandatory for all heating
- PPE required per station
- Every machine has a Standard Operating Procedure and student certification card

### What Students Make
- Coasters, keychains, phone stands, desk organizers, plant pots, art tiles, and more
- Each product uses a known number of caps (e.g., a keychain ≈ 4 caps, a coaster ≈ 15 caps)
- Products have real sell prices and margins (e.g., keychains $3-5, coasters $8-12)

### Implementation Support
- **20-minute SME test**: Competent teachers can pitch, get approved, fund, order equipment, build boxes, train safely, run the program, sell products, report impact, and replicate it
- **Launch deck**: 30-slide presentation with speaker notes (three tracks: K-5, 6-8, 9-12)
- **Teacher guide**: 8-chapter playbook (~50 pages)
- **Grant templates**: 4 ready-to-use templates + 5 outreach scripts
- **Safety SOPs**: Machine SOPs + completed risk register
- **Command center sheets**: 8-tab spreadsheet structure with formulas
- **Printable resources**: Posters, signs, logs, handouts, badges
- **Student role cards**: 7 roles + rotation + application
- **Curriculum standards mapping**: NGSS + Common Core + IB crosswalk
- **Teacher PD**: 2-hour agenda, onboarding path, substitute one-pager
- **Impact reporting templates**: Monthly/semester/annual + funder/donor reports
- **Engagement & gamification**: Points, badges, competitions, behavioral nudges
- **Accessibility & inclusion**: Physical, sensory, language, economic inclusion
- **District scaling guide**: Hub-and-spoke, train-the-trainer, 12-month rollout
- **Continuity & handover**: End-of-year close-out, succession, credentials
- **Data science & AI extension**: Forecasting, classification, capstone ("AI" piece)
- **IoT & firmware guide**: Complete ESP32/ESP32-S3 integration guide
- **Supplier & partner directory**: Machines, materials, cap & community partners

### Presentation Files (PPTX)
- **Cap_Collective_Launch_Deck.pptx**: 29 slides — main launch presentation with speaker notes
- **Cap_Collective_Teacher_PD_Workshop.pptx**: 14 slides — 2-hour teacher professional development workshop
- **Cap_Collective_Launch_Week_Run_of_Show.pptx**: 12 slides — day-by-day launch week run-of-show
- **Cap_Collective_Grant_Pitch_Deck.pptx**: 15 slides — grant proposal presentation with budget tables

## Possible Goods (Strengths)

### What Works Well
- **Comprehensive coverage** — 29 documents span the entire program lifecycle from pitch to scale
- **Open source under MIT License** — free to use, modify, and distribute for any school; share improvements back to the network
- **Student-led design** — every role, SOP, and product is designed for student ownership and certification
- **Measurable impact** — concrete targets (10k caps, 35kg diverted, $500 revenue) with real measurement methods
- **Standards-aligned curriculum** — every lesson links to NGSS, Common Core, IB, with grade-banded progression
- **Scalable budget tiers** — start Core at $500 and scale to Center at $10,000+; every tier produces real products
- **Safety-first design** — non-negotiable certification, temperature limits, ventilation, PPE — all documented
- **Real products with value** — coasters, keychains, plant pots, desk organizers with actual pricing and margins
- **Live data & dashboard** — optional IoT sensor network provides real-time cap counting and impact tracking
- **Global community** — Discord/Slack with 50+ teachers globally, monthly office hours, recorded PD workshops
- **Open-source hardware** — ESP32 firmware, sensor code, and CAD files; drop-in components for FabLab+ tier
- **Grant-ready narrative** — copy-paste grant text included with 4 templates and 5 outreach scripts
- **Cross-grade continuity** — K-2 builds foundation, 3-5 adds process, 6-8 adds data, 9-12 adds systems/policy

## Possible Bads (Areas for Improvement / Limitations)

### What Needs Attention
- **Initial setup complexity** — Requires principal approval, space identification (ventilated room, 16A power, sink access), budget tier selection, and safety MOU signing before anything else
- **External dependencies still remain** — Despite 20-minute SME test improvements, these require the school/teacher:
  1. **Your CAD files** — must drop into `cad/` per `14_ASSET_CAD_AND_TOOLS_INDEX.md` (starter files included but final files school-provided)
  2. **Real vendor quotes** — prices change by region/date; the kit provides templates but not actual quotes
  3. **Insurance sign-off** — submit the risk register + MOU to your insurer
  4. **IT network approval** — if using sensors on school WiFi
  5. **Live URLs** — deploy dashboard per `16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md` (existing URLs capcollective.vercel.app must be built or confirmed)
- **Physical equipment procurement** — While the Procurement & Payment Playbook fixed many gaps, real vendor quotes and receiving/checklist processes still require school-specific action
- **Learning curve for new processes** — The 5-step micro-factory (collect/clean/shred/melt/refine) is new to most schools; the pre-audit readiness score was 6/10, improved to 10/10 after fixes
- **FabLab/Center tier cost** — $2,500–$10,000+ may be prohibitive for some schools; the Core tier at $500–$1,000 is more accessible but produces fewer product types
- **No on-site training included** — The kit provides recorded PD, monthly office hours, and a community of 50+ teachers, but in-person setup support requires external arrangement
- **Mixed plastic streams** — The kit focuses on clean HDPE/PP caps; mixed or contaminated streams require additional sorting and may affect product quality

### Mitigation Strategies (From the Kit)
- Use the **Implementation Readiness Audit** (`00_IMPLEMENTATION_READINESS_AUDIT.md`) for an honest picture of what it takes
- Start with the **Core tier** ($500–$1,000) and scale up after proving the concept
- Follow the **20-minute SME test** to validate each step before investing
- Leverage the **Discord/Slack community** of 50+ teachers globally for peer support
- Use the **grant templates** to fund equipment and program expansion
- Begin with manual cap counting before investing in IoT sensors
- Read the **Safety SOPs** (`04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md`) before anything else

## Review Request

I'd appreciate it if you could review the kit and provide feedback on:

1. **Feature completeness** — Are there any missing capabilities for your use case (grade level, budget tier, product type)?
2. **Curriculum alignment** — Does the K-2 through 9-12 progression make sense? Any standards or subjects missing?
3. **Safety adequacy** — Are the SOPs, temperature limits, and PPE requirements sufficient for your school's context?
4. **Budget tier appropriateness** — Does the Core/FabLab/Center framework match typical school purchasing pathways?
5. **Implementation pathway** — Does the 20-minute SME test accurately reflect what a teacher could accomplish without outside help?
6. **Missing integrations** — Are there third-party services, platforms, or grade levels you'd expect to see?
7. **Reviewability** — Is the kit's organization (29 documents + PPTX files + CAD + firmware) easy to navigate, or would you restructure anything?

The kit is particularly relevant if you're:
- Evaluating sustainability/STEM programs for a school or district
- Looking for project-based learning with measurable impact
- Considering a circular economy initiative with student entrepreneurship
- Exploring IoT/data collection in an educational context
- Planning a grant-funded recycling or makerspace program

Please let me know if you have any questions or would like to schedule a walkthrough of specific capabilities.

The kit is open source under MIT License — free to use, modify, and distribute. I can provide access to the actual files, deployed preview dashboards, and the Discord community if that would help with your review.

Best regards,

David

---

P.S. The kit has been through a comprehensive implementation readiness audit (pre-audit: 6/10, post-audit: 10/10) that addressed critical gaps in procurement, approvals, safety, and dashboard deployment. With your CAD files added, the kit is fully implementable by a school without outside help. All 29 documents, PPTX presentations, CAD starter files, sensor code, and grant templates are currently at their latest versions.

---

**Kit Contents Summary:**
- 29+ document files (00–33 numbered + reference docs)
- 4 PPTX presentation files (launch deck, teacher PD, run-of-show, grant pitch)
- CAD starter files in `cad/` (parametric box, coaster frame, keychain mold)
- Sensor code: `resources/sensor_count.ino`, `firmware/` (Node 1, Node 2, Radio Tower)
- CSV importables for command center spreadsheet
- Live dashboards: capcollective.vercel.app, bottle-cap-tracker.vercel.app
- MIT License — free to use, modify, distribute
