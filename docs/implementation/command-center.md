---
title: Command Center Workbook
---

# Cap Collective — Command Center Workbook
### Google Sheets Structure, Formulas & Setup Guide
**8 Tabs | Auto-calculating | Chart-ready | Grant-report-ready**

> **How to build it:** Create a new Google Sheet named **"Cap Collective Command Center"**. Create 8 tabs with the exact names below, paste the headers and starting formulas, then duplicate rows as needed. Importable CSV files for each tab are in the `csv/` folder of this kit.

---

## TAB 1: 📊 Collection Tracker
**Purpose:** Log every collection event. Feeds all downstream calculations.

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Date | Location | Collector(s) | Cap Count | Weight (kg) | Avg Cap Mass (g) | Color Mix % (Light) | Color Mix % (Dark) | Notes | Photo Link |

**Sample rows:**
```
2026-10-09 | Cafeteria | Group A | 842 | 2.1 | 2.49 | 55 | 45 | First collection! | [link]
2026-10-16 | Cafeteria | Group B | 1176 | 2.9 | 2.47 | 60 | 40 | After assembly push | [link]
2026-10-16 | Gym | Group C | 430 | 1.1 | 2.56 | 50 | 50 | | [link]
```

**Formulas (place below data or in a summary block):**
| Cell | Formula | Meaning |
|------|---------|---------|
| K2 | `=SUM(D2:D)` | Total caps collected |
| K3 | `=SUM(E2:E)` | Total weight (kg) |
| K4 | `=IF(SUM(D2:D)=0,0,SUM(E2:E)*1000/SUM(D2:D))` | Avg cap mass (g) |
| K5 | `=SUM(D2:D)/10000` | % toward 10k goal |
| K6 | `=SUM(E2:E)*1.9` | CO₂e avoided (kg) |

**Conditional formatting:**
- Weight column E → color scale (light to dark green)
- Cap Count D → data bar
- Row highlight if Notes contains "first"

---

## TAB 2: 🛒 Equipment Procurement Planner
**Purpose:** Track sourcing, quotes, orders, delivery. Auto-sums by tier.

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Item | Tier | Qty | Unit Cost | Currency | Est. Total (USD) | Regional Supplier | Link | Status | Lead Time (wks) |

**Tier values:** Core / FabLab / Center
**Status values:** Research / Quoted / Ordered / Received

**Sample rows:**
```
Heat Press (Transmax) | Core | 1 | 320 | EUR | =D2*E_convert | YOW! (DE) | [link] | Ordered | 2
Hand Tool Kit | Core | 2 | 45 | EUR | ... | ronixtools | [link] | Received | 1
PPE Bundle (10x) | Core | 1 | 180 | EUR | ... | Amazon.de | [link] | Ordered | 1
Secabo TC5 Press | FabLab | 1 | 950 | EUR | ... | YOW! (DE) | [link] | Research | 3
Bambu Lab A1 | FabLab | 1 | 299 | EUR | ... | Bambu | [link] | Research | 2
ESP32 + IR Kit | FabLab | 5 | 9 | USD | ... | Amazon | [link] | Ordered | 1
SDS Injection Mini 2 | Center | 1 | 3200 | EUR | ... | SDS UK | [link] | Research | 6
Trotec Speedy 50 | Center | 1 | 12000 | EUR | ... | Trotec | [link] | Research | 8
```

**Currency conversion:** Put exchange rates in a config area:
| Cell | Value |
|------|-------|
| P1 | EUR→USD |
| P2 | GBP→USD |

**Formula (F2):**
```
=IF(E2="USD",D2*C2,IF(E2="EUR",D2*C2*$P$1,D2*C2*$P$2))
```

**Tier subtotals:**
| Item | Formula |
|------|---------|
| Core Total | `=SUMIF($B:$B,"Core",$F:$F)` |
| FabLab Total | `=SUMIF($B:$B,"FabLab",$F:$F)` |
| Center Total | `=SUMIF($B:$B,"Center",$F:$F)` |
| Grand Total | `=SUM(F:F)` |

**Conditional formatting:** Status = "Received" → green; "Ordered" → yellow; "Research" → gray.

---

## TAB 3: 💰 Budget & Finance
**Purpose:** Income, expenses, P&L per product, break-even.

### Section A: Income
| A | B | C | D |
|---|---|---|---|
| Date | Source | Category | Amount (USD) |
```
2026-10-01 | PTA Grant | Grant | 1500
2026-11-15 | Coaster sales | Product | 240
2026-11-20 | Café sponsorship | Sponsorship | 300
```
**Formula:** `=SUM(D2:D)` → Total Income

**Category subtotals:** `=SUMIF(C:C,"Grant",D:D)` etc.

### Section B: Expenses
| A | B | C | D |
|---|---|---|---|
| Date | Item | Category | Amount (USD) |
```
2026-10-05 | Heat press | Equipment | 350
2026-10-20 | Baking paper | Consumable | 25
2026-11-01 | PPE restock | Consumable | 90
```
**Category subtotals:** Equipment / Consumable / Maintenance / Marketing

### Section C: P&L by Product
| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Product | Units Made | Units Sold | Price | Revenue | Material Cost | Margin % |
```
Coaster (set) | 60 | 40 | 10 | =C2*D2 | =C2*2.5 | =IF(E2=0,0,(E2-F2)/E2)
Desk Organizer | 30 | 18 | 15 | ...
Keychain | 120 | 95 | 4 | ...
```
**Formula (G2):** `=(E2-F2)/E2` formatted as %.

### Section D: Break-Even Calculator
| A | B |
|---|---|
| Fixed Costs (total) | `=SUM expenses equipment` |
| Avg Margin per Unit | `=AVERAGE(G2:G4)` |
| Break-Even Units | `=ROUNDUP(B1/B2,0)` |
| Break-Even Revenue | `=B3*AVERAGE(D2:D4)` |

### Section E: Net Position
| A | B |
|---|---|
| Total Income | `=Income!Total` |
| Total Expenses | `=Expenses!Total` |
| **Net Balance** | `=B1-B2` |
| Reinvestment to Garden | `=B3*0.5` |

---

## TAB 4: 📚 Curriculum & Lesson Tracker
**Purpose:** Map lessons, standards, and completion status.

| A | B | C | D | E | F | G | H |
|---|---|---|---|---|---|---|---|
| Grade Band | Unit | Lesson | Standard(s) | Duration | Materials | Status | Teacher Notes |

**Sample rows:**
```
K-2 | Sorting | What Are Plastic Caps? | K-ESS3-3, 2-PS1-1 | 45 min | Cap pile, worksheets | Delivered | Worked great!
3-5 | Build | Build the Box | 3-5-ETS1-1 | 90 min | Box kits, glue | Planned | Need more clamps
6-8 | Tech | Programming the Counter | MS-ETS1-2 | 90 min | ESP32 kits | Planned | 
9-12 | Systems | Systems Optimization | HS-ETS1-3 | 90 min | Command Center | Planned |
```

**Status values:** Planned / Delivered / Assessed
**Summary formulas:**
- Lessons delivered: `=COUNTIF(G:G,"Delivered")`
- Completion %: `=COUNTIF(G:G,"Delivered")/COUNTA(C2:C)`

---

## TAB 5: 👥 Student Roles & Scheduling
**Purpose:** Track certifications, shifts, hours.

| A | B | C | D | E | F | G | H | I | J |
|---|---|---|---|---|---|---|---|---|---|
| Student Name | Grade | Role(s) | Shift | Safety Cert? | Shredder Cert? | Press Cert? | Laser Cert? | Hours Logged | Notes |

**Sample rows:**
```
Alex M. | 7 | Collection Captain | Mon | Yes | No | No | No | 12 | Natural leader
Jordan T. | 8 | Shredder Op | Wed | Yes | Yes | No | No | 8 | 
Sam R. | 10 | Data Analyst | Fri | Yes | Yes | Yes | Yes | 20 | Builds dashboard
```

**Certification values:** Yes / No / Pending
**Summary:**
| Metric | Formula |
|--------|---------|
| Total students | `=COUNTA(A2:A)` |
| Certified (any) | `=COUNTIF(E:E,"Yes")` |
| Total hours | `=SUM(I:I)` |
| Shredder-ready (6+) | `=SUMPRODUCT((B2:B>=6)*(F2:F="Yes"))` |

**Rotation helper:** Add a column "Next Rotation" with `=I2+14` logic or manual dates.

---

## TAB 6: 🏪 Product Inventory & Sales
**Purpose:** Track SKUs, stock, sales, margin, bestsellers.

| A | B | C | D | E | F | G | H | I | J | K |
|---|---|---|---|---|---|---|---|---|---|---|
| SKU | Product | Batch # | Qty Made | Qty Sold | Qty In Stock | Price | Revenue | Material Cost | Margin % | Customer Type |

**Sample rows:**
```
CST-001 | Coaster Set | B001 | 60 | 40 | 20 | 10 | =E2*G2 | =E2*2.5 | =IF(H2=0,0,(H2-I2)/H2) | Student
KEY-001 | Keychain | B002 | 120 | 95 | 25 | 4 | =E3*G3 | =E3*0.6 | ... | Community
ORG-001 | Desk Organizer | B003 | 30 | 18 | 12 | 15 | ... | ... | | Staff
```

**Formulas:**
| Metric | Formula |
|--------|---------|
| Qty In Stock | `=D2-E2` |
| Revenue | `=E2*G2` |
| Margin % | `=IF(H2=0,0,(H2-I2)/H2)` |
| Total Revenue | `=SUM(H:H)` |
| Best Seller | `=INDEX(B:B,MATCH(MAX(E:E),E:E,0))` |
| Reorder Alert | `=IF(F2<10,"REORDER","OK")` |

**Customer Type values:** Student / Staff / Community / Online / B2B

---

## TAB 7: 🌍 Impact Dashboard
**Purpose:** Summary view. All charts feed here. Export for reports/grants.

### Key Metrics Block
| Metric | Value | Formula |
|--------|-------|---------|
| Caps Collected | | `='Collection Tracker'!K2` |
| Weight Diverted (kg) | | `='Collection Tracker'!K3` |
| Products Made | | `=SUM('Product Inventory'!D:D)` |
| Products Sold | | `=SUM('Product Inventory'!E:E)` |
| Revenue (USD) | | `='Product Inventory'!Total Revenue` |
| Students Engaged | | `='Student Roles'!Total` |
| Students Certified | | `='Student Roles'!Certified` |
| CO₂e Avoided (kg) | | `='Collection Tracker'!K6` |
| Est. Recycling Value (€) | | `='Collection Tracker'!K3*0.35` |
| Participation % | | `='Student Roles'!Total/TotalStudents` |

### Charts to Build (Insert → Chart)
1. **Weekly Collection Trend** — Line chart of Date vs Cap Count
2. **Product Mix** — Pie chart of Product vs Qty Sold
3. **Revenue vs Cost** — Column chart, two series
4. **Participation** — Gauge or radial for % target
5. **Collection by Location** — Bar chart from Collection Tracker
6. **Caps by Color** — Stacked bar (light/dark mix)

### Goals Tracker
| Goal | Current | Target | Status |
|------|---------|--------|--------|
| Caps | `=caps` | 10000 | `=IF(current>=target,"✅ ACHIEVED","⬆ "&ROUND(target-current,0)&" to go")` |
| Weight (kg) | | 35 | ... |
| Revenue | | 500 | ... |
| Participation % | | 80 | ... |

---

## TAB 8: 📡 Sensor Data Log (API-Connected)
**Purpose:** Auto-feed from ESP32/Arduino via webhook (Google Apps Script) or manual.

| A | B | C | D | E | F | G |
|---|---|---|---|---|---|---|
| Timestamp | Bin ID | Count | Fill % | Temperature (°C) | Status | Source |

**Sample rows:**
```
2026-10-16 08:14:22 | CAFE-01 | 842 | 42 | 22 | OK | ESP32
2026-10-16 08:19:45 | GYM-01 | 430 | 28 | 23 | OK | ESP32
2026-10-16 15:02:11 | CAFE-01 | 890 | 45 | 24 | OK | ESP32
```

**Fill % formula (if not sent):** `=MIN(100,ROUND(C2/2000*100,0))` (2000 cap capacity)
**Status logic:** `=IF(D2>=90,"FULL — COLLECT NOW",IF(D2>=70,"Monitor","OK"))`

### Webhook Setup (Google Apps Script)
```javascript
function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Sensor Data Log");
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    new Date(), data.binId, data.count, data.fill,
    data.temp, "OK", "ESP32"
  ]);
  return ContentService.createTextOutput("OK");
}
```
*Deploy → New deployment → Web app → Anyone can access → copy URL → paste into ESP32 code.*

---

## SETUP CHECKLIST
- [ ] Create sheet named "Cap Collective Command Center"
- [ ] Add 8 tabs with exact names above
- [ ] Paste headers & formulas
- [ ] Set currency rates in Procurement tab (P1, P2)
- [ ] Build 6 charts on Impact Dashboard
- [ ] Set conditional formatting on Trackers
- [ ] Share read-only "Impact Dashboard" publicly (for website embed)
- [ ] Set up Apps Script webhook (if using sensors)
- [ ] Test with 1 sample row per tab, then clear samples

---

## COLOR/FORMAT STANDARD
| Element | Color | Hex |
|---------|-------|-----|
| Header rows | Dark green | #1B5E20 |
| Sub-headers | Light green | #A5D6A7 |
| Input cells | Pale yellow | #FFF9C4 |
| Calculated cells | Light gray (locked) | #ECEFF1 |
| Alerts | Red | #EF9A9A |
| Goals achieved | Green | #C8E6C9 |

**Font:** Roboto or Arial. Numbers right-aligned, text left.

---
*Command Center v1.0 — pairs with Teacher Implementation Guide & Launch Deck.*