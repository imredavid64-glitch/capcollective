---
title: IoT & Live Tracking
---

# 29. IoT & Live Tracking — Auto-Counted Caps

**Purpose:** Replace hand-counting with sensor-based, real-time collection data. Every drop = an automatic log, refreshed every minute.

---

## 1. Why Automate?

| Problem | Manual counting | IoT counting |
|---|---|---|
| Count accuracy | ~90% (human fatigue) | ~99%+ (weight-based) |
| Time per bag | 5–10 minutes | 0 (automatic) |
| Motivation | Leaderboard updates weekly | Leaderboard updates live |
| Teacher overhead | High | Near zero |

The tracker feeds the public dashboard (CAPBOT + website), the class leaderboards, and the semester forecast.

---

## 2. Reference Build: Weight-Sensing Hopper (IR-free option)

A load cell under a collection hopper is the most robust school-priced design.

- **Parts (≈ $60–90 per hopper):**
  - Load cell 5 kg + HX711 amplifier
  - Arduino Uno / Wemos D1 Mini (Wi-Fi)
  - Available in `cad/` and firmware in `resources/sensor_count.ino`
- **Math:** 1 cap ≈ 2.5 g → sensor reading ÷ 0.0025 kg = estimated caps. Recalibrate monthly with a 100-cap test bag.
- **Logic:**
  1. Weigh hopper every 2 seconds, take a rolling median (3 readings) to cancel vibration noise.
  2. When weight increases by ≥ 25 g (≈ 10 caps), the delta is added to the "pending" total.
  3. Every 60 seconds, POST the pending total to the tracker API and reset pending to 0.
  4. After each POST, record the new baseline weight.

Caps are counted on the way **in**, so emptying the hopper doesn't double-count.

---

## 3. Wiring Into the Live Tracker

POST to the same endpoint the website uses:

```
POST /api/tracker
{ "school": "AISB", "classLabel": "HOPPER-1", "caps": 240, "date": "YYYY-MM-DD" }
```

Class leaderboards update automatically. Optionally raise the class label

```
HOPPER-1-KG
```

to track hardware reliability per unit.

---

## 4. Verification Checklist (before going live)

- [ ] Sensor agrees with a manual 100-cap count within ±2%.
- [ ] Hopper handles a full 5 kg bag without jamming or tilting.
- [ ] Wi-Fi reconnects after a power cut (add a watchdog reset).
- [ ] Duplicate POST protection: the board keeps a timestamp of its last successful send.
- [ ] Power: use a 9 V/2 A adapter; add a battery at the school end to survive outages.

---

## 5. Data Ethics & Privacy

- Log **no student names** — only school, class label, caps, timestamp.
- Onboarding doc (doc 15) must mention the sensor in the permission forms.
- Data is the school's own; the dashboard is public but aggregate-only, never per-student.

---

## 6. Scale-Up Path

1. **Semester 1:** one hopper in the main hub; website + leaderboard feeds from manual logs too.
2. **Semester 2:** hopper per wing/gateway; classes race live.
3. **Year 2 (multi-school):** hoppers at partner schools, central dashboard in the Command Center.
