---
title: Visual Implementation Tracker
---

# Visual Implementation Tracker

The dashboard ships with an interactive **Implementation Kit** — a checklist of the
29 steps that take a school from "idea" to a running, student-led program.

Open it at **[capcollective.vercel.app](https://capcollective.vercel.app)** and scroll to
**Implementation Kit**, or run the dashboard locally (see
[Dashboard Deployment](../technical/dashboard.md)).

---

## What it does

- **29 checklist items** grouped into 6 phases
- **Progress bar** with completed / total counts
- **Filter by phase** and **hide completed** items
- **Saved automatically** in your browser (`localStorage`) — no account, no backend
- **Export / import JSON** to move progress between devices or share with a co-teacher

!!! note "Privacy"
    Progress is stored only in your browser. Nothing is uploaded. Clearing site data
    or using a different browser starts a fresh checklist — export a JSON backup first
    if you want to keep it.

---

## The six phases

| Phase | Focus | Example items |
|-------|-------|---------------|
| **Launch** | Approval, space, funding, safety MOU | Secure admin buy-in · Select budget tier · Sign Safety MOU |
| **Build** | Equipment, boxes, sensors, training | Order equipment · Build collection boxes · Complete safety certifications |
| **Process** | First production cycles | First collection · First heat-press run · Establish QC |
| **Product** | Design, molds, branding | Design sprint · Production molds · Packaging |
| **Market** | Store, sales, events, reporting | Eco-store launch · Community event · Impact report |
| **Scale** | Reflect, document, hand off | Document SOPs · Train next cohort · Grant writing |

---

## Suggested pace

Most schools complete the kit across **one semester (12–16 weeks)**:

- **Weeks 1–3:** Launch
- **Weeks 4–6:** Build
- **Weeks 7–10:** Process + Product
- **Weeks 11–13:** Market
- **Weeks 14–16:** Scale + handover

You do not need every item to start collecting — the critical path is:

```
Admin buy-in → Safety MOU → Equipment order → Boxes built →
Safety certifications → First collection → First press run
```

---

## Exporting progress

Click **Export JSON** to download a file like:

```json
{
  "version": "1.0",
  "exportDate": "2026-10-30T12:00:00.000Z",
  "items": [
    { "id": "launch-admin-buyin", "completed": true, "completedAt": "2026-10-30T11:58:00.000Z" },
    { "id": "launch-space", "completed": false, "completedAt": null }
  ],
  "summary": { "total": 29, "completed": 1, "requiredCompleted": 1, "requiredTotal": 12 }
}
```

Use **Import JSON** on another device (or next year's teacher's laptop) to restore it.

---

## Related

- [Command Center](command-center.md) — the spreadsheet workbook behind the tracker
- [Operations Playbook](operations.md) — what to do each week
- [Continuity & Handover](../scaling/continuity.md) — pass the completed checklist on
