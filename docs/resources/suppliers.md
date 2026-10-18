# Supplier & Partner Directory

Global sourcing guide for Cap Collective equipment, materials, and community partners.

---

## Equipment Suppliers

### Heat Presses

| Supplier | Models | Regions | Price Range | Notes |
|----------|--------|---------|-------------|-------|
| **Geo Knight** | DK20S, DK25S | Global | $800-2,500 | US-made, lifetime support |
| **Hotronix** | Fusion IQ, Auto Open | NA, EU | $1,200-3,500 | Auto-open, digital controls |
| **Stahls'** | Hotronix, MAXX | NA | $1,000-3,000 | Education discounts |
| **Vevor** | 15×15, 16×20 | Global | $200-600 | Budget option, check specs |
| **F2C** | 15×15, 16×20 | Global | $150-400 | Amazon, hobbyist grade |
| **Local Welding Supply** | Custom | Local | Varies | Can build custom platens |

**Specs to Verify:**
- [ ] Even heating (±5°C across platen)
- [ ] Digital temp + timer
- [ ] Pressure gauge + adjustment
- [ ] Auto-open (safety) or manual
- [ ] 15×15" minimum (coasters)
- [ ] 16×20" for tiles (FabLab+)
- [ ] 120V/240V per region

---

### Shredders

| Supplier | Models | Regions | Price Range | Notes |
|----------|--------|---------|-------------|-------|
| **Precious Plastic** | Shredder v4, Pro | Global (open source) | $500-2,000 DIY | Community plans, GDPR option |
| **Filamaker** | Shredder 2.0 | EU, Global | €1,500-3,000 | CE marked, safety interlocks |
| **3devo** | SHR3D IT | Global | $3,000-5,000 | Industrial, filament grade |
| **Vecoplan** | VAZ series | Global | $10,000+ | Industrial, continuous |
| **Local Fabrication** | Custom | Local | $500-2,000 | Use Precious Plastic plans |

**Specs to Verify:**
- [ ] 5-8mm output (sieve included)
- [ ] Safety interlocks (hopper + hopper)
- [ ] Emergency stop (large, accessible)
- [ ] Motor: 1.5-3kW (HDPE/PP)
- [ ] Throughput: 5-20 kg/hr
- [ ] Noise level <85 dB
- [ ] CE/UL marking per region

**Budget Alternative:** Modified paper shredder (cross-cut) + 3D printed hopper — $100-300, limited life

---

### Laser Cutters

| Supplier | Models | Regions | Price Range | Notes |
|----------|--------|---------|-------------|-------|
| **Glowforge** | Basic, Plus, Pro | NA | $3,000-6,000 | Cloud-based, easy |
| **xTool** | D1, P2, M1 | Global | $700-3,000 | Diode + CO2 options |
| **OMTech** | 40W-150W | Global | $1,500-8,000 | CO2, good value |
| **Thunder Laser** | Nova, Bolt | Global | $3,000-15,000 | Ruida controller |
| **Trotec** | Speedy, SP | Global | $15,000+ | Industrial, Ruby software |
| **Epilog** | Zing, Fusion | NA | $8,000+ | US-made, great support |

**Specs to Verify (HDPE 3mm):**
- [ ] 40W+ CO2 (diode struggles with HDPE)
- [ ] Bed size: 20×12" minimum (coasters)
- [ ] Air assist (mandatory for HDPE)
- [ ] Exhaust port + fan included
- [ ] Software: LightBurn / RDWorks / proprietary
- [ ] Safety interlocks + window

**Budget Option:** 40W CO2 (OMTech/Vevor) + LightBurn — $1,500-2,500

---

### 3D Printers

| Supplier | Models | Regions | Price Range | Notes |
|----------|--------|---------|-------------|-------|
| **Bambu Lab** | P1S, X1C, A1 | Global | $350-1,300 | Fast, enclosed, AMS |
| **Prusa** | MK4, XL | Global | $800-2,000 | Reliable, open source |
| **Creality** | K1C, Ender 3 V3 | Global | $200-600 | Budget, fast |
| **Elegoo** | Neptune 4, Saturn | Global | $200-500 | Resin + FDM |
| **Prusa (Education)** | MK4 + Kit | Global | $600 | Edu discount |

**For Molds (PETG/ASA):**
- [ ] Enclosed chamber (ASA warps)
- [ ] 260°C+ nozzle temp
- [ ] 100°C+ bed temp
- [ ] 0.4mm nozzle (0.2mm for detail)
- [ ] 100% infill capability

---

### Injection Molders

| Supplier | Models | Regions | Price Range | Notes |
|----------|--------|---------|-------------|-------|
| **Holimaker** | Desktop | Global | $3,000-5,000 | Benchtop, manual |
| **Mini-Jector** | Model 55 | NA | $4,000 | Pneumatic, small |
| **Morgan Industries** | Model 150 | NA | $8,000 | Hydraulic |
| **Boy Machines** | 15S-22S | Global | $15,000+ | Industrial |
| **Custom (Local)** | CNC mold + press | Local | $5,000-15,000 | Use arbor press + mold |

**For School Use:**
- [ ] Manual or pneumatic (simpler)
- [ ] 50-100g shot size (keychains)
- [ ] 180-220°C nozzle temp
- [ ] Quick mold change
- [ ] Safety: two-hand start, guards

---

### CNC Mills (Center Tier)

| Supplier | Models | Regions | Price Range | Notes |
|----------|--------|---------|-------------|-------|
| **Carbide 3D** | Nomad, Shapeoko | NA | $2,000-5,000 | Desktop, GRBL |
| **Avid CNC** | Pro, Benchtop | NA | $4,000-12,000 | Rigid, Mach3/4 |
| **Tormach** | 440, 1100M | NA | $10,000-30,000 | PathPilot, support |
| **Haas** | Mini Mill, VF-2 | Global | $30,000+ | Industrial |
| **Local Makerspace** | Shared access | Local | $50-200/hr | No capital cost |

**For Aluminum Molds:**
- [ ] 0.001" repeatability
- [ ] 10,000+ RPM spindle
- [ ] Flood coolant
- [ ] 12"×12"×6" work envelope min
- [ ] Fusion 360 CAM post-processor

---

### Sensors & Electronics

| Item | Suppliers | Price | Notes |
|------|-----------|-------|-------|
| ESP32 DevKit | Espressif, Amazon, DigiKey | $8-15 | WROOM-32, 4MB flash |
| ESP32-S3 CAM | Freenove, Amazon | $18-25 | OV2640, PSRAM |
| FC-51 IR Sensor | Amazon, DigiKey, AliExpress | $1-2 | Digital out, adjustable |
| HC-SR04 Ultrasonic | Amazon, DigiKey | $2-3 | 5V, 2cm-400cm |
| DS18B20 Temp | Amazon, DigiKey | $2-3 | Waterproof version |
| BME280 Temp/Humidity | Amazon, DigiKey | $3-5 | I2C |
| 18650 Battery + TP4056 | Amazon, NKON | $5-10 | Protected cells |
| Solar Panel 5V 5W | Amazon, Renogy | $10-20 | USB output |
| MicroSD Module | Amazon, DigiKey | $1-2 | SPI |

**Regional Distributors:**
- **NA:** DigiKey, Mouser, Adafruit, SparkFun, Amazon
- **EU:** Mouser EU, Farnell, Reichelt, BerryBase
- **UK:** Pimoroni, The Pi Hut, CPC
- **AU:** Core Electronics, Little Bird, Jaycar
- **Global:** AliExpress (bulk), LCSC (components)

---

## Materials & Consumables

### HDPE/PP Flake Sources

| Source | Cost | Notes |
|--------|------|-------|
| **Own Collection** | Free | Best quality control |
| **Local Recyclers** | $0.20-0.50/lb | Verify HDPE/PP only |
| **Precious Plastic Bazaar** | €2-4/kg | Community vetted |
| **Plastic Bank** | $0.50-1.00/lb | Social impact |
| **Local Cafés/Bars** | Free (pickup) | Build relationships |

### Parchment Paper
| Supplier | Spec | Price | Notes |
|----------|------|-------|-------|
| **Reynolds** | 15×16", 75 sq ft | $8-12 | Grocery store |
| **If You Care** | Unbleached, 70 sq ft | $6-8 | Compostable |
| **Restaurant Depot** | 24×36", 1000 ft | $30-40 | Bulk |
| **Silicone Sheets** | 12×12", reusable | $15-25/5 | 50+ uses each |

### PPE (Bulk Educational)

| Item | Suppliers | Price (10-pack) | Specs |
|------|-----------|-----------------|-------|
| Safety Goggles | Uline, Grainger, Amazon | $30-50 | ANSI Z87.1 |
| Heat Gloves (500°F) | Grainger, Uline, Amazon | $60-100 | 14"+ gauntlet |
| N95/KN95 Respirators | Amazon, Medical suppliers | $20-40 | NIOSH/CE |
| Heat Aprons | Grainger, Uline | $40-60 | Kevlar/leather |
| Ear Protection | Uline, Amazon | $20-30 | NRR 25+ |
| Nitrile Gloves | Costco, Amazon, Uline | $15-25 | 100/box |

### Packaging
| Item | Supplier | Price | Notes |
|------|----------|-------|-------|
| Kraft Paper Roll | Uline, Amazon | $20-30/roll | 30"×100' |
| Twine/Jute | Amazon, Uline | $10-15 | 100% biodegradable |
| Sticker Labels | Avery, OnlineLabels | $15-25 | 2.625×1", 3000/roll |
| Gift Boxes | Uline, Packlane | $0.50-1.50 | Custom print available |
| Shopping Bags | Uline, EcoEnclose | $0.20-0.50 | Kraft, recycled |

---

## Community Partners

### Cap Collection Partners

| Partner Type | What They Give | What They Get | Approach |
|--------------|----------------|---------------|----------|
| **Cafés** | 50-200 caps/week | Branded coasters (50/mo) | "Close the loop" |
| **Restaurants** | 100-500 caps/week | Coasters + marketing | ESG story |
| **Breweries** | 200-1000 caps/week | Custom coasters + tap handles | Brand alignment |
| **Offices** | 50-100 caps/week | Desk organizers + impact report | CSR |
| **Schools (Other)** | 100-500 caps/week | Curriculum share + products | District network |
| **Community Events** | 500-2000 caps/day | Pop-up store + awareness | Visibility |
| **Municipal Recycling** | Bulk HDPE/PP | Clean stream | Contract |

### Partnership Agreement Template
```
CAP COLLECTIVE PARTNERSHIP AGREEMENT

PARTNER: _________________________  CONTACT: _________________________
SCHOOL: _________________________  PROGRAM LEAD: _________________________

PARTNER PROVIDES:
☐ Clean HDPE #2 / PP #5 caps (weekly qty: ______)
☐ Collection bin placement (location: ___________)
☐ Weekly pickup access (day/time: ___________)
☐ Staff engagement (optional)

SCHOOL PROVIDES:
☐ Branded coasters (______ sets/month)
☐ "Zero Waste Partner" window decal
☐ Monthly impact report (caps, CO2e, student hours)
☐ Social media features (tag: @___________)
☐ Student thank-you card (quarterly)
☐ Invitation to Cap Collective Expo

TERM: ______ months  |  REVIEW: Quarterly  |  TERMINATION: 30 days notice

SIGNATURES:
Partner: _________________________  Date: ___________
School: _________________________  Date: ___________
```

---

## Grant & Funding Partners

### Foundation Directory (US Focus)

| Foundation | Focus | Range | Deadline | Notes |
|------------|-------|-------|----------|-------|
| **NSF DRK-12** | STEM Education | $500K-5M | Annual | Research partnership |
| **EPA Environmental Ed** | Env Education | $50K-200K | Annual | Local priority |
| **Kellogg Foundation** | Education + Community | $25K-500K | Rolling | Place-based |
| **Walton Family** | K-12 Innovation | $100K-2M | Quarterly | Charter-friendly |
| **Gates Foundation** | Education | $100K-10M | By invite | Global health link |
| **Local Community Found.** | Local Impact | $5K-100K | Quarterly | Relationship-based |
| **Corporate Foundations** | STEM/Environment | $5K-100K | Varies | Employee match |

### Corporate Sponsors (Target List)

| Company | Focus | Typical Grant | Contact Path |
|---------|-------|---------------|--------------|
| **Coca-Cola** | Recycling/Water | $10K-100K | Local bottler |
| **PepsiCo** | Circular Economy | $10K-100K | Regional office |
| **Nestlé** | Packaging/Water | $10K-100K | Local factory |
| **Unilever** | Sustainable Living | $10K-100K | Regional HQ |
| **SC Johnson** | Waste Reduction | $5K-50K | Community relations |
| **3M** | STEM Education | $5K-50K | 3Mgives |
| **Dow** | Circular Economy | $10K-100K | STEM outreach |
| **Eastman** | Molecular Recycling | $10K-100K | Innovation |
| **Local Utilities** | Energy/Env Ed | $1K-10K | Community relations |

---

## Regional Supplier Maps

### United States (by Region)

**Northeast:** Glazer's, Uline NJ, McMaster-Carr, Local welding supply
**Southeast:** Uline GA, Grainger, Local plastics recyclers
**Midwest:** McMaster-Carr IL, Uline WI, Local ag/ind suppliers
**Southwest:** Uline TX, Grainger, Border industrial suppliers
**West Coast:** Uline CA, McMaster-Carr CA, TAP Plastics, Local fab shops

### Canada
**National:** Uline Canada, Acklands-Grainger, Princess Auto, Lee Valley
**Plastics:** Emco, Local recyclers (Recycle BC, etc.)
**Electronics:** DigiKey CA, Mouser CA, Creatron, PiShop

### Europe
**DE:** Reichelt, Conrad, Pollin, Voelkner, Local recyclers (DSD)
**UK:** RS Components, Farnell, CPC, Pimoroni, The Pi Hut
**FR:** Gotronic, Lextronic, Conrad FR, Local recyclers (Citeo)
**NL:** Antratek, Kiwi Electronics, Electrokit, Local recyclers

### Australia/NZ
**AU:** Core Electronics, Little Bird, Jaycar, RS Components AU
**NZ:** Nice Gear, MindKits, PB Tech, Jaycar NZ

---

## Bulk Purchasing (District Level)

### Consolidated Order Template
```
DISTRICT BULK ORDER — Cap Collective
District: ___________  Coordinator: ___________  Date: ___________

CONSOLIDATED NEEDS (from all schools)
| Item | Total Qty | Unit Cost | Extended | Vendor Options |
|------|-----------|-----------|----------|----------------|
| Heat Press (15×15) | 8 | $ | $ | Geo Knight, Hotronix, Vevor |
| Shredder (GDPR) | 8 | $ | $ | Precious Plastic, Filamaker |
| Laser (40W CO2) | 4 | $ | $ | OMTech, xTool, Glowforge |
| ESP32 DevKit | 50 | $ | $ | DigiKey, Amazon, Espressif |
| FC-51 IR Sensor | 50 | $ | $ | DigiKey, Amazon, AliExpress |
| PPE Kit (10/student) | 200 | $ | $ | Uline, Grainger |
| Parchment (bulk) | 20 rolls | $ | $ | Restaurant Depot |

TOTAL ESTIMATE: $__________

VOLUME DISCOUNT TARGETS
- 5+ presses: 10% off
- 10+ shredders: 15% off
- 20+ lasers: 10% off
- 100+ ESP32: 20% off
- PPE 200+: 15% off

APPROVAL: _________________________  DATE: ___________
```

---

## Supplier Evaluation Scorecard

| Criteria | Weight | Score (1-5) | Notes |
|----------|--------|-------------|-------|
| **Price** | 25% | | |
| **Quality/Reliability** | 25% | | |
| **Lead Time** | 15% | | |
| **Support/Warranty** | 15% | | |
| **Educational Discount** | 10% | | |
| **Sustainability** | 10% | | |
| **Local/Regional** | 5% | | |

**Threshold:** ≥3.5 weighted average = Approved Vendor

---

## Maintenance Contracts

| Equipment | Annual Cost | Includes | Recommended |
|-----------|-------------|----------|-------------|
| Heat Press | $150-300 | Calibration, platen resurface, thermocouple | Yes (annual) |
| Shredder | $200-500 | Blade sharpen, oil, guard check | Yes (annual) |
| Laser Cutter | $300-800 | Lens clean, alignment, tube check | Yes (annual) |
| Injection Molder | $500-1,500 | Heater check, purge, seal replace | Yes (annual) |
| CNC Mill | $1,000-3,000 | Ball screw, spindle, way lube | Yes (annual) |
| 3D Printers | $100-300 | Belt, nozzle, firmware, bed level | Per 2000 hrs |

**District Contract:** Negotiate multi-unit discount (20-30% off single)

---

## Emergency Contacts

| Supplier | Emergency Line | Response Time | Notes |
|----------|----------------|---------------|-------|
| Geo Knight | 1-800-XXX-XXXX | 24/7 | Press down = production stop |
| Filamaker | +421-XXX-XXXX | Business hrs | EU based |
| OmTech | 1-800-XXX-XXXX | 24/7 chat | Laser tube = 1-2 day ship |
| Bambu Lab | support@bambulab.com | 12/7 | AMS jam = print farm down |
| Local Welding Supply | Local | Same day | Custom parts, emergency repair |
| District Tech Dept | Internal | 4 hrs | First line for all equipment |