# Cap Collective — Tools, CAD & Digital Assets Index
### The Single Source of Truth for Every Physical Tool and Digital File
**Answers: "Do we have the tools? Where are the design files?"**

---

## PART 1: PHYSICAL TOOLS & EQUIPMENT INVENTORY

### 1.1 Core Hand Tools (All tiers)
| Tool | Purpose | Qty | Approx Cost | Where |
|------|---------|-----|-------------|-------|
| Box knife / utility knife | Trimming, opening | 2 | $10 | Hardware |
| Cutting mat (A3) | Safe cutting | 1 | $15 | Hardware |
| Pliers (needle-nose) | Demolding, trimming | 2 | $15 | ronixtools.com |
| Wire/flush cutters | Trimming flash | 2 | $12 | ronixtools.com |
| Deburring tool | Smoothing edges | 1 | $10 | Hardware |
| Sandpaper (120/240/400 grit) | Finishing | pack | $10 | Hardware |
| Digital scale (0.1g–5kg) | Weighing flakes/products | 1 | $20 | Amazon |
| IR thermometer | Temp verification (mandatory) | 1 | $20 | Amazon |
| Calipers | Thickness QC | 1 | $15 | Amazon |
| Measuring jugs / basins | Wash station | 2 | $10 | Hardware |
| Old toothbrushes | Scrubbing caps | 5 | $3 | — |
| Mesh drying rack | Air-drying caps | 2 | $15 | Hardware |
| Mesh sieve (5-8mm) | Flake consistency | 1 | $15 | Hardware |
| Storage buckets (labeled) | Flakes by color | 4 | $20 | Hardware |
| Wood glue + clamps | Box assembly | 1 set | $20 | Hardware |
| Fire blanket + extinguisher | Safety | 1 | $40 | Safety supplier |
| First-aid kit | Safety | 1 | $25 | Safety supplier |

### 1.2 PPE (Per Station)
| Item | Spec | Qty | Cost |
|------|------|-----|------|
| Safety goggles | ANSI Z87.1 | 10 | $40 |
| Heat-resistant gloves | 500°F / 260°C rated | 6 pr | $60 |
| VOC respirators | N95 minimum | 10 | $50 |
| Aprons | Heat resistant | 6 | $40 |
| Ear protection | For shredder/saw | 6 | $30 |

### 1.3 Machinery by Tier
| Machine | Core | FabLab | Center | Purpose |
|---------|------|--------|--------|---------|
| Heat press | ✓ | ✓ | ✓ | Melt sheets |
| Shredder | basic | ✓ | ✓ | Flakes |
| 3D printer | — | ✓ | ✓ | Molds, parts |
| Arduino/ESP32 + IR | — | ✓ | ✓ | Counting |
| CNC mill | — | basic | ✓ | Aluminum molds |
| Laser cutter | — | — | ✓ | Precision parts |
| Injection molder | — | — | ✓ | 3D products |
| Filament maker | — | — | opt | 3D filament |
| Industrial ventilation | — | — | ✓ | Scale/safety |

> **Reality:** You can run a full Core-tier program with the hand tools + heat press + basic shredder + PPE. Everything else scales up.

---

## PART 2: DIGITAL FILES INDEX

### 2.1 CAD / Fabrication Files (the "design tools")
| File | Type | Used For | Status |
|------|------|----------|--------|
| `cad/collection_box.scad` | OpenSCAD (2D DXF) | Laser-cut collection box panels | ✅ Starter provided |
| `cad/coaster_press_frame.scad` | OpenSCAD (2D DXF) | Heat-press mold frame for coasters | ✅ Starter provided |
| `cad/keychain_mold.scad` | OpenSCAD (3D STL) | Two-part injection mold | ✅ Starter provided |
| `cad/README.md` | Docs | How to use/edit/export | ✅ |
| `[YOUR CAD FILES]` | .f3d/.step/.dxf/.stl | Final box + molds | ⏳ Drop-in (you provide) |

### 2.2 Software / Digital Tools
| Tool | Purpose | Cost | Where |
|------|---------|------|-------|
| Fusion 360 | Mold & part design, DXF | Free (edu) | Autodesk |
| Tinkercad | Beginner 3D/DXF | Free | tinkercad.com |
| Trotec Ruby | Laser job control | With laser | Trotec |
| Bambu Studio / PrusaSlicer | 3D printing | Free | Vendor |
| OpenSCAD | Parametric CAD | Free | openscad.org |
| Google Sheets | Command Center | Free | Google |
| Looker Studio | Dashboard | Free | Google |
| Arduino IDE | Sensor code | Free | arduino.cc |
| VS Code + Next.js | Website (optional) | Free | Microsoft |

### 2.3 Code & Scripts
| File | Purpose |
|------|---------|
| `resources/sensor_count.ino` | ESP32 cap counter |
| Apps Script webhook | (in `03_...` Tab 8) posts sensor data to Sheets |
| Next.js fetch snippet | (in `16_...`) optional website |

### 2.4 Documents / Printables / Sheets
| Asset | File |
|-------|------|
| Presentation | `01_LAUNCH_DECK_PRESENTATION.md` |
| Guide | `02_TEACHER_IMPLEMENTATION_GUIDE.md` |
| Workbook | `03_COMMAND_CENTER_SHEETS.md` + `csv/` |
| Safety | `04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md` |
| Printables | `05_PRINTABLE_RESOURCES.md` |
| Standards | `06_CURRICULUM_STANDARDS_MAPPING.md` |
| Admin | `07_ADMIN_QUICKSTART_CHECKLIST.md` |
| Grants | `08_GRANT_AND_FUNDRAISING_TEMPLATES.md` |
| Roles | `09_STUDENT_ROLE_CARDS_AND_SCHEDULING.md` |
| Products/QC | `10_PRODUCT_DEVELOPMENT_AND_QC.md` |
| Speaker notes | `11_LAUNCH_DECK_SPEAKER_NOTES.md` |
| Buy-in | `12_SCHOOL_BUYIN_AND_APPROVAL_PLAYBOOK.md` |
| Payment | `13_PROCUREMENT_PAYMENT_AND_FINANCE_PLAYBOOK.md` |
| Forms | `15_FORMS_AND_PERMISSIONS_PACK.md` |
| Dashboard | `16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md` |
| Audit | `00_IMPLEMENTATION_READINESS_AUDIT.md` |

---

## PART 3: HOW TO USE THE STARTER CAD FILES

### 3.1 OpenSCAD files (parametric)
1. Install **OpenSCAD** (free, openscad.org).
2. Open the `.scad` file, edit the **parameters at the top** (dimensions, thickness).
3. **For laser cutting (2D):** set view to Top (numpad 7) → **File → Export → Export as DXF**.
4. **For 3D printing (STL):** Render (F6) → **File → Export → Export as STL**.

### 3.2 Adding your own CAD files
When you provide your CAD files:
1. Place them in the `cad/` folder.
2. Name them by convention: `box_panel_front.dxf`, `mold_coaster_v1.stl`, `box_full.f3d`.
3. Update the table in **Section 2.1** above.
4. Add a one-line note about what machine + material each uses.

### 3.3 File naming convention
```
[part]_[variant]_[version].[ext]
Examples:
  box_front_v1.dxf
  mold_keychain_v2.stl
  coaster_jig_v1.dxf
  collection_box_v1.f3d
```

---

## PART 4: MATERIALS LIST (Consumables)
| Material | Spec | Use | Reorder level |
|----------|------|-----|---------------|
| Parchment/baking paper | Non-stick sheets | Heat press sandwich | 2 packs |
| Dish soap | Mild | Wash station | 1 bottle |
| Nitrile gloves | — | Handling | 1 box |
| Kraft paper + twine | — | Product packaging | roll + spool |
| Labels (printable) | A4 sticker sheets | Product labels | 1 pack |
| Acrylic sheet | 3mm | Box windows | per box |
| Plywood | 5mm | Boxes | per box |
| Release agent | Silicone spray | Mold prep | 1 can |
| Shredder oil sheets | — | Blade maintenance | 1 pack |
| Heat-press platen cleaner | — | Maintenance | 1 |

---

## PART 5: WHAT'S MISSING (External — you provide)
| Item | Who provides | Where it goes |
|------|--------------|---------------|
| Final CAD (box, molds) | You (soon) | `cad/` |
| Real vendor quotes | Program Lead | Command Center Tab 2 |
| Insurance confirmation | School | Forms Pack |
| WiFi approval | IT | Forms Pack Form 14 |
| Live dashboard URL | Data Analyst | `16_...` |

---

## PART 6: ASSET HEALTH CHECK
Run this before launch:
```
☐ All hand tools present & functional
☐ PPE stocked (goggles/gloves/masks per station)
☐ Heat press: temp verified, cord OK
☐ Shredder: blades clear, e-stop works
☐ Ventilation: tested (tissue test)
☐ Fire extinguisher + blanket + first aid present
☐ CAD files present (or starter files accepted for v1)
☐ Command Center populated
☐ Dashboard live & shared
☐ Sensor code uploaded & tested (if used)
☐ All forms printed & filed
☐ Warranties + serial numbers recorded
```
---
*Tools & Assets Index v1.0 — update Section 2.1 when CAD files are added.*
