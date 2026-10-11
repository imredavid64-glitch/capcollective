# 32. Digital Products & Online Store

**Purpose:** Sell student-made products online (Eco-Store), publish digital goods (lesson plan packs, certificates, the kit itself), and turn revenue into the program's operating budget.

---

## 1. The Eco-Store (physical products)

Hosted at `shop.html`, driven by the `/api/checkout` endpoint.

| Product | Avg bottle caps | Price |
|---|---|---|
| Coaster set (4) | ~160 | $12 |
| Keychain | ~10 | $3.50 |
| Phone stand | ~60 | $15 |
| Desk organizer | ~120 | $22 |
| Plant pot | ~150 | $18 |
| Art tile | ~30 | $9 |

### Checkout flow

1. Student adds items (browser-side cart in localStorage).
2. "Pay online" → serverless checkout creates a secure Stripe payment link.
3. "Order for pickup" → order summary is emailed to the Eco-Store manager (student-run).
4. Student production crew builds the order, checks QC (doc 10), and ships or hands over.

### Pricing rules

- Price ≥ 2× material cost + a small labor credit per student production hour.
- Proceeds split: 40% materials & repairs, 40% garden/community fund, 20% event fund.
- Never discount below material cost even for friends (protects the learning economy).

---

## 2. Digital Products (recurring revenue)

- **Lesson pack re-licensing:** other schools pay a small fee to use the curriculum with a licensed copy (buy once, reuse year after year).
- **Certificate print packs:** schools order printable certification templates.
- **Pro receipts/impact reports** for sponsors (doc 23) — a paid tier with extra fidelity.

Keep prices humble; the goal is sustainability, not profit.

---

## 3. Processing & Compliance

- Online card payments: use Stripe, with a school/org bank account behind it.
- Wait until v2 to take international orders — ship domestic first.
- Handle VAT/tax with your finance contact (doc 13); student re-issue receipts only via the template.
- All products must carry a care label: "Recycled HDPE/PP; keep under 60°C — do not microwave."

---

## 4. Inventory Batching

Produce in batches, not per-order:

| Batch | Target | Trigger |
|---|---|---|
| Keychains & coasters | 40 units | Every 2 weeks |
| Phone stands / organizers | 10 units | Every month |
| Plant pots / art tiles | 8 units | Monthly or on demand |

Unify batches with the Command Center sheet so QC and sales always have stock numbers.

---

## 5. Success Metrics (semester)

- $500+ revenue from store + digital products.
- ≥ 60% of product inventory sold (avoid dead stock).
- Average 3-day turnaround from order to pickup.
- Every order linked to a logged production batch (measured impact).