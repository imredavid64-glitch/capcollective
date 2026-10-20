# Cap Collective: School Implementation Kit - Master Plan

## Project Overview
A complete, scalable K-12 circular economy program where students collect HDPE bottle caps, process them into flakes, and manufacture valuable products (coasters, organizers, tiles) using heat presses, injection molders, and laser cutters. Integrates STEM, sustainability, entrepreneurship, and data science.

---

## Kit Components

### 1. Google Slides: "Cap Collective School Launch Deck"
**Audience:** Administrators, teachers, students, parents, community partners
**Structure:** 3 presentation tracks in one deck (hide/show slides per audience)

| Section | Slides | K-5 Focus | 6-8 Focus | 9-12 Focus |
|---------|--------|-----------|-----------|------------|
| **The Why** | 1-5 | Story-based: "Cap's Journey" | Data: Plastic crisis stats | Systems: Circular economy models |
| **The How** | 6-12 | Simple: Box → Shred → Press | Technical: Sensors, temp control | Engineering: Mold design, QC |
| **The What** | 13-18 | Products: Coasters, tiles | Business: School store, pricing | Innovation: R&D, new molds |
| **Implementation** | 19-25 | Classroom jobs, rotation | Club structure, leadership | Program management, scaling |
| **Impact Tracking** | 26-30 | Sticker charts, class goals | Dashboards, CSV export | API, real-time sensors, KPIs |

**Total: ~30 slides** with speaker notes, embedded videos, printable handouts

---

### 2. Google Docs: "Cap Collective Teacher Implementation Guide"
**Audience:** Teachers, club advisors, makerspace coordinators
**Length:** ~40-50 pages with appendices

#### Chapter Structure:
1. **Getting Started** (Week 0-1)
   - Admin buy-in checklist
   - Space & safety assessment
   - Budget tier selection (Core / FabLab / Center)

2. **Curriculum Mapping** (K-12 Standards Alignment)
   - NGSS / IB / National standards crosswalk
   - Lesson plans by grade band (3 per band)
   - Interdisciplinary connections (Art, Math, CS, Business)

3. **Operations Playbook**
   - Collection system setup (zone mapping, box building)
   - Weekly workflow: Collect → Clean → Shred → Press → Finish
   - Role cards: Collector, Washer, Shredder Op, Press Op, QC, Data Analyst

4. **Equipment & Safety**
   - Procurement guide (global suppliers by region)
   - Risk assessments, SOPs, maintenance schedules
   - Ventilation, PPE, emergency procedures

5. **Product Development**
   - Design thinking process for new molds
   - Quality control standards
   - Packaging, branding, pricing

6. **Data & Impact Measurement**
   - Sensor setup (Arduino/ESP32 IR beam-break)
   - Dashboard configuration (Vercel/Google Sheets)
   - Reporting templates (monthly, semester, annual)

7. **Community & Fundraising**
   - Eco-store launch guide
   - Grant templates (Erasmus+, local foundations)
   - Partnership outreach scripts

8. **Appendices**
   - Printable posters, signs, log sheets
   - Troubleshooting FAQ
   - Glossary, standards alignment tables

---

### 3. Google Sheets: "Cap Collective Command Center" (Multi-tab Workbook)

#### Tab 1: **Collection Tracker** (Live + Manual Entry)
- Date, Location, Collector, Count, Weight (kg), Color Mix %, Notes
- Auto-calculates: Running totals, diversion rates, CO2e saved
- Conditional formatting for goals/alerts

#### Tab 2: **Equipment Procurement Planner**
- Item, Tier (Core/FabLab/Center), Qty, Unit Cost (USD/EUR/GBP), Regional Supplier Links, Status (Research/Quoted/Ordered/Received), Lead Time, Budget Code
- Auto-sum by tier, currency conversion

#### Tab 3: **Budget & Finance**
- **Income:** Grants, product sales, sponsorships, PTA funds
- **Expenses:** Equipment, consumables (parchment, molds, PPE), maintenance, marketing
- **P&L by Product:** Coaster, Organizer, Tile, Custom
- **Break-even calculator** per product line

#### Tab 4: **Curriculum & Lesson Tracker**
- Grade Band, Unit, Lesson, Standard(s), Duration, Materials, Assessment, Status, Teacher Notes
- Links to Slides/Docs resources

#### Tab 5: **Student Roles & Scheduling**
- Student Name, Grade, Role(s), Shift (Mon-Fri), Certifications (Safety, Shredder, Press, Laser), Hours Logged
- Auto-rotation scheduler

#### Tab 6: **Product Inventory & Sales**
- SKU, Product, Batch#, Qty Made, Qty Sold, Price, Revenue, Material Cost, Margin, Customer Type (Student/Staff/Community/Online)
- Reorder alerts, bestseller analysis

#### Tab 7: **Impact Dashboard** (Summary View - Charts feed here)
- Key Metrics: Caps Collected, kg Diverted, Products Made, Revenue, Students Engaged, CO2e Avoided
- Charts: Weekly collection trend, Product mix, Revenue vs Cost, Participation %
- Export-ready for reports/grants

#### Tab 8: **Sensor Data Log** (API-connected)
- Timestamp, Bin ID, Count, Fill %, Temperature, Status
- Feeds from Arduino/ESP32 via webhook

---

## Grade-Band Differentiation

### Grades K-2: "Cap Detectives"
- **Focus:** Observation, sorting, counting, storytelling
- **Activities:** Cap hunts, color sorting games, "Where does plastic go?" story
- **Products:** Pre-made coasters (decorate only)
- **Tech:** Picture-based data entry on tablet

### Grades 3-5: "Cap Engineers"
- **Focus:** Process understanding, measurement, basic design
- **Activities:** Build collection boxes, wash/shred (supervised), press sheets, design coasters in Tinkercad
- **Products:** Coasters, simple keychains (injection)
- **Tech:** Google Forms data entry, simple charts

### Grades 6-8: "Cap Innovators"
- **Focus:** Data analysis, product development, entrepreneurship
- **Activities:** Sensor programming (Arduino), dashboard design, mold design (Fusion 360), business plan
- **Products:** Full line + custom orders
- **Tech:** Sheets/CSV analysis, 3D printing molds, laser cutting

### Grades 9-12: "Cap Systems Designers"
- **Focus:** Systems engineering, LCA, policy, scaling
- **Activities:** Life cycle assessment, grant writing, supply chain optimization, new material R&D (PP, LDPE)
- **Products:** Architectural tiles, furniture components, B2B orders
- **Tech:** API integration, Python analysis, CAD/CAM, CNC mold making

---

## Implementation Timeline (18-Week Semester)

| Phase | Weeks | Activities | Deliverables |
|-------|-------|------------|--------------|
| **Launch** | 1-2 | Admin approval, space prep, equipment order, team formation | Signed MOU, equipment ordered, student leads named |
| **Build** | 3-4 | Build boxes, install sensors, safety training, first collection | 5+ boxes deployed, sensor dashboard live |
| **Process** | 5-8 | Weekly cycles: collect→wash→shred→press→finish | 500+ caps processed, first product batch |
| **Product** | 9-12 | Design sprint, mold making, quality control, branding | 3+ product lines, packaging, price list |
| **Market** | 13-15 | Eco-store launch, sales, community events, data reporting | $500+ revenue, impact report v1 |
| **Scale** | 16-18 | Reflect, document, train next cohort, grant writing | Handoff guide, grant submitted, celebration |

---

## Budget Tiers (Global Adaptable)

| Tier | Est. Cost (USD) | Equipment | Best For |
|------|-----------------|-----------|----------|
| **Core** | $500-1,000 | Heat press (budget), hand tools, PPE, DIY boxes, shredder (manual/basic) | Primary, clubs, pilot |
| **FabLab** | $2,500-5,000 | Auto-open press, Bambu/Prusa 3D printer, Arduino sensors, GDPR shredder, basic CNC | Middle/High, makerspaces |
| **Center** | $10,000+ | Premium press, injection molder, Trotec laser, precision molds, ventilation, multiple printers | Tech schools, hubs, districts |

*All costs have regional supplier mappings in Sheets Tab 2*

---

## Google API Integration Plan

### Required APIs:
- **Google Slides API** - Create presentation from template
- **Google Docs API** - Create guide from markdown
- **Google Sheets API** - Create workbook with tabs, formulas, charts, conditional formatting
- **Google Drive API** - Organize in folder, set permissions

### Authentication:
- Service account with domain-wide delegation (for school domain)
- Or OAuth 2.0 with user consent
- Scopes: `drive`, `spreadsheets`, `documents`, `presentations`

### Folder Structure:
```
/Cap Collective School Kit/
├── 01_Launch_Deck (Slides)
├── 02_Teacher_Guide (Doc)
├── 03_Command_Center (Sheets)
├── 04_Resources (Folder)
│   ├── Printables
│   ├── Templates
│   └── Media
└── 05_Archive (previous versions)
```

---

## Next Steps

1. **Confirm Google Cloud Project & Credentials** - Need project ID, service account key, or OAuth client
2. **Review Content Outline** - Approve slide count, doc chapters, sheet tabs
3. **Regional Supplier Data** - Confirm priority regions for procurement sheet
4. **Brand Assets** - Logo, colors, fonts for consistent theming
5. **Pilot Schools** - Names for case study placeholders

---

## Success Metrics (First Year)
- 10+ schools implementing
- 100,000+ caps diverted
- 500+ students directly engaged
- $5,000+ in product revenue reinvested
- 3+ grant applications submitted
- Open-source curriculum adopted by 2+ districts
