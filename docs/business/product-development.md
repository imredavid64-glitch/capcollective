---
title: Product Development & QC
---

# Cap Collective — Product Development & Quality Control Guide
### From Caps to Finished Products: Design, Production, QC & Pricing
**For Grades 6-12 (advanced) and teacher use**

---

## PART 1: THE PRODUCT DESIGN PROCESS

### 1.1 Design Thinking Framework (5 Stages)
```
1. EMPATHIZE  → Interview users. "What product do you need?"
2. DEFINE     → Write a design brief. "We need a coaster that fits a mug."
3. IDEATE     → Sketch 10+ ideas. No bad ideas yet.
4. PROTOTYPE  → Make it (paper → CAD → physical).
5. TEST       → Does it work? Get feedback. Iterate.
```

### 1.2 Design Brief Template
```
DESIGN BRIEF
Product: ______________
User: ______________
Function: What must it DO? ______________
Constraints: Size, weight, material, cost ______________
Criteria for success: ______________
```

### 1.3 CAD Tools by Level
| Grade | Tool | Output |
|-------|------|--------|
| 3-5 | Tinkercad | Simple 3D + DXF |
| 6-8 | Fusion 360 (basic) | 3D parts, molds, DXF |
| 9-12 | Fusion 360 (advanced) | Complex molds, assemblies |

**Fusion 360 uses:**
- Design 2D DXF for laser cutting
- Design 3D molds via shape subtraction
- Design machine add-ons (e.g., counter housing)

---

## PART 2: PRODUCTION WORKFLOWS PER PRODUCT

### 2.1 COASTER (Any tier)
```
1. COLLECT caps (#2 HDPE — check!)
2. SHRED to 5-8mm flakes (sieve)
3. MELT: parchment sandwich, 140°C, 5 min + flip 5 min
4. COOL under weight
5. DESIGN a DXF in Fusion 360 (circle/square + logo)
6. LASER cut the sheet (low power, high speed)
7. SAND edges (120→400 grit)
8. Done!
```
**Yield:** ~120g caps → 1 coaster set (×4)

### 2.2 DESK ORGANIZER
```
1-5. Same as coaster (make sheet)
6. DESIGN a fold-up / slot assembly in Fusion 360
7. LASER cut flat-pack parts
8. ASSEMBLE (no glue — friction fit or slot)
9. QC: smooth all edges
```

### 2.3 KEYCHAIN (Injection Molder)
```
1. COLLECT + SHRED
2. DESIGN a two-part mold (gate + vent) in Fusion 360
3. FABRICATE mold: 3D print or CNC mill
4. INJECT: barrel 180°C, clamp mold, pull lever
5. DEMOLD after 2-3 min
6. TRIM flash with cutters
7. Add keyring loop
8. QC
```

### 2.4 PLANT POT / SEEDLING TRAY (Injection)
```
1-2. Collect + shred
3-6. Mold (as above), produce pot
7. Drill drainage hole (if needed)
8. QC: no cracks, even walls
```

### 2.5 OUTDOOR TILE (FabLab/Center)
```
1-5. Collect, shred, melt into a LARGE sheet
6. PRESS into 12×12" frame (larger press)
7. Texturize top (optional stamp)
8. CURE 24 hrs
9. QC: flatness, no cracks
```

### 2.6 3D PRINTER FILAMENT (Center)
```
1-2. Collect + shred
3. DRY flakes (moisture ruins filament)
4. EXTRUDE: feed through filament maker at 1.75mm
5. WIND onto reel at steady speed
6. QC: measure diameter (±0.05mm), test print
```

---

## PART 3: QUALITY CONTROL SYSTEM

### 3.1 The QC Mindset
Every product is a **data point**. If it fails, we learn. Document everything.

### 3.2 QC Checklist (Per Batch)
```
BATCH QC RECORD
Batch #: ______  Date: ______  Operators: ______
Material: ☐ HDPE #2  ☐ PP #5   Color: ______

INCOMING (flakes):
☐ Size uniform (5-8mm sieve) ________
☐ No visible contamination ________
☐ Color consistent (or intentional mix) ________
☐ Dry (no moisture) ________

PRODUCTION (sheet/product):
☐ Thickness ±0.5mm → measured: ____ mm
☐ No burn marks / discoloration ________
☐ No voids/bubbles visible ________
☐ Dimensions match spec: ____ × ____ mm
☐ Edges sanded smooth (no sharp) ________
☐ Branding stamp applied ________

VERDICT: ☐ PASS  ☐ FAIL — reason: ____________
QC Signature: ______________
```

### 3.3 Defect Diagnosis Table
| Defect | Root Cause | Fix | Prevention |
|--------|-----------|-----|------------|
| Voids/bubbles | Uneven flake size | Re-sieve, pre-mix | Standardize shred |
| Warping | Fast cooling | Cool under weight | Weight + slow cool |
| Burn marks | Temp too high | Lower to 140°C | IR thermo checks |
| Discoloration | Contaminated caps | Reject dirty caps | Stricter wash QC |
| Weak/brittle | Mixed polymers | Sort by #2/#5 only | Material ID training |
| Rough edges | No sanding | Sand 120→400 | Finishing SOP |
| Sticking in mold | No release agent | Apply agent | Prep checklist |
| Short shots | Underfilled mold | More material, hotter | Calibrate barrel |
| Flashing | Overfilled mold | Less material, tighter clamp | Clamp torque spec |

### 3.4 Rejection Handling
```
FAILED BATCH → Re-shred → Re-process → Document lesson → Try again
```
Nothing is wasted — a failed product is just future feedstock. This is the "infinite loop."

---

## PART 4: COSTING, PRICING & ECONOMICS

### 4.1 Cost Per Unit Formula
```
Material Cost = (grams used / 1000) × cost per kg of input
  → HDPE flake equivalent: assume $0.50/kg (collection is free)
Labor Cost = (minutes × wage rate) — use $0 for student labor, but track hours
Overhead = electricity + consumables + depreciation (estimate $0.10/unit)
Total Cost = Material + Overhead (+ Labor if applicable)
```

### 4.2 Pricing Strategy
```
Price = Total Cost × 3  (gives ~65-70% margin after costs)
OR
Price = Comparable retail price (market-based) if higher
```

### 4.3 Product Economics Table
| Product | Material (g) | Mat. Cost | Overhead | Total Cost | Price | Margin | Margin % |
|---------|--------------|-----------|----------|------------|-------|--------|----------|
| Coaster (set ×4) | 120 | $0.06 | $0.40 | $0.46 | $10 | $9.54 | 95% |
| Desk Organizer | 250 | $0.13 | $0.50 | $0.63 | $15 | $14.37 | 96% |
| Keychain | 30 | $0.02 | $0.10 | $0.12 | $4 | $3.88 | 97% |
| Plant Pot | 200 | $0.10 | $0.40 | $0.50 | $8 | $7.50 | 94% |
| Outdoor Tile | 400 | $0.20 | $0.80 | $1.00 | $20 | $19.00 | 95% |
| Filament (1kg) | 1000 | $0.50 | $2.00 | $2.50 | $25 | $22.50 | 90% |

*Margins appear very high because material is free (collected). Real costs are labor + equipment — track those too.*

### 4.4 True Break-Even (Including Equipment)
```
Equipment investment: $1,000 (Core tier)
Avg margin per unit: ~$9
Break-even units: $1,000 / $9 ≈ 112 units
```
**Realistic:** Sell 112 products to pay back equipment. Then profit funds the garden.

---

## PART 5: BRANDING & PACKAGING

### 5.1 Brand Identity
- **Name:** "Cap Collective [School]"
- **Tagline:** "From waste to worth."
- **Colors:** Green + earth tones
- **Logo:** A bottle cap with a recycle arrow

### 5.2 Product Label Template
```
┌─────────────────────────┐
│   CAP COLLECTIVE        │
│   [School Name]         │
│                         │
│   [Product Name]        │
│   Made from [X] caps    │
│   diverted from waste   │
│                         │
│   Batch: [B###]         │
│   Material: HDPE #2     │
│                         │
│   ♻️ 100% Recyclable    │
│   Made by students 🌱   │
└─────────────────────────┘
```

### 5.3 Packaging Principles
- **No plastic** — kraft paper, cardboard, twine
- **Story card** — tell the impact story
- **Recyclable** — packaging = product values

### 5.4 Story Card (insert in each product)
> "This product was made from bottle caps collected by students at [School]. By buying it, you diverted plastic from landfill, funded our school garden, and supported student makers. Thank you. — The Cap Collective Team"

---

## PART 6: PRODUCT CATALOG (For Eco-Store)

| SKU | Product | Description | Price | Best Seller |
|-----|---------|-------------|-------|-------------|
| CST-001 | Coaster Set (×4) | Marbled HDPE coasters | $10 | ⭐ |
| ORG-001 | Desk Organizer | Fold-up pen/phone holder | $15 | |
| KEY-001 | Keychain | Custom logo/shape | $4 | ⭐ |
| POT-001 | Plant Pot | Drainage hole, 3 sizes | $8 | |
| TILE-001 | Outdoor Tile | 12×12" patio/decor | $20 | |
| FIL-001 | Filament Reel | 1kg, 1.75mm | $25 | |
| SIG-001 | Custom Signage | Laser-cut school sign | $25-50 | |
| CST-002 | Gift Bundle | Coaster set + keychain | $15 | ⭐ |

---

## PART 7: QUALITY STANDARDS BY PRODUCT
| Product | Key QC Metrics | Standard |
|---------|----------------|----------|
| Coaster | Flatness, thickness | ±0.5mm, no warp |
| Organizer | Fit, edge quality | Snug assembly, smooth |
| Keychain | Loop strength | Withstands 5kg pull |
| Plant Pot | Wall uniformity | Even, no cracks |
| Tile | Flatness, durability | ±1mm, no cracking |
| Filament | Diameter | 1.75mm ±0.05mm |

---
*Product Development & QC v1.0 — design, produce, verify, price.*