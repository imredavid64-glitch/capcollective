# Cap Collective — Data Science & AI Extension Guide
### From "We Count Caps" to "We Predict the Future"
**Delivers the original project's "AI model to predict material needs" — as real student projects, with tools and rubrics.**

---

# PART 1: THE DATA YOU ALREADY HAVE
Every session produces data. By week 4 you have a real dataset:
| Field | Example | Type |
|-------|---------|------|
| Date | 2026-10-14 | date |
| Box ID | CAF-1 | category |
| Caps counted | 412 | number |
| Weight (kg) | 1.03 | number |
| Material (HDPE/PP) | HDPE | category |
| Weather | rain/sun | category |
| Day of week | Monday | category |
| Products made | 6 | number |
| Revenue ($) | 45 | number |

**This is enough to teach real data science.** No fake datasets needed.

---

# PART 2: SKILL PROGRESSION (By Grade Band)

## Grades 3-5 — "Data Detectives"
- Tally, count, graph (Lessons K3, E3)
- **Tools:** paper, Google Sheets
- **Project:** "Which day collects the most caps?"

## Grades 6-8 — "Data Analysts"
- Mean/median/mode; bar/line charts
- **Tools:** Google Sheets (AVERAGE, SUM, charts)
- **Project:** Weekly collection trendline + prediction next week

## Grades 9-12 — "Data Scientists & AI Engineers"
- Descriptive + correlation + regression
- **Tools:** Google Colab (Python/pandas/scikit-learn)
- **Projects:** forecasting, classification, optimization

---

# PART 3: PROJECT LADDER (Ready to Assign)

### PROJECT 1 — Describe (all grades)
**Question:** "What does our collection data look like?"
**Do:** count, mean caps/day, busiest day, best box.
**Output:** 1 chart + 3 sentences.

### PROJECT 2 — Correlate (6-12)
**Question:** "What predicts more caps?"
**Do:** compare caps vs day-of-week, weather, events.
**Output:** correlation table + claim ("Events double collection").

### PROJECT 3 — Predict (9-12) ★ the "AI model"
**Question:** "How many caps will we collect next week?"
**Method:** simple linear regression (or time-series trend).
**Steps:**
1. Load CSV into Colab.
2. Plot weekly totals.
3. Fit a trend line.
4. Forecast next 4 weeks.
5. Report error (how wrong were we?).
**Output:** forecast + confidence note.

```python
# Starter (Google Colab)
import pandas as pd, numpy as np
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression

df = pd.read_csv("collection.csv")
df["week"] = pd.to_datetime(df["date"]).dt.isocalendar().week
weekly = df.groupby("week")["caps"].sum().reset_index()

X = weekly[["week"]]; y = weekly["caps"]
model = LinearRegression().fit(X, y)

next_weeks = np.arange(weekly["week"].max()+1, weekly["week"].max()+5).reshape(-1,1)
pred = model.predict(next_weeks)
print("Forecast:", pred)
plt.plot(weekly["week"], y, label="actual")
plt.plot(next_weeks, pred, "r--", label="forecast")
plt.legend(); plt.show()
```

### PROJECT 4 — Classify (9-12, advanced)
**Question:** "Can AI sort caps by type from a photo?"
**Method:** image classification (transfer learning).
**Tools:** Teachable Machine (no-code) or TensorFlow/Keras on Colab.
**Steps:**
1. Photograph 50+ caps per class (HDPE, PP, reject).
2. Train a model (Teachable Machine → export).
3. Test accuracy on new photos.
4. Discuss failure modes (lighting, blur, damage).
**Output:** working demo + accuracy report.
**Ethics:** dataset bias, misclassification risk.

### PROJECT 5 — Optimize (9-12, capstone)
**Question:** "How can we maximize yield / minimize waste?"
**Method:** analyze the workflow data (Lesson S2); regression on variables.
**Output:** data-backed process change + measured result.

---

# PART 4: TOOLKIT (What to Use)

| Tool | Level | Cost | Use |
|------|-------|------|-----|
| Google Sheets | 3-12 | Free | All basics |
| Looker Studio | 6-12 | Free | Dashboards |
| Google Colab | 9-12 | Free | Python, ML |
| Teachable Machine | 6-12 | Free | Vision classifier |
| Edge Impulse | 9-12 | Free tier | TinyML on ESP32 |
| Kaggle | 9-12 | Free | Datasets, learning |
| Excel | all | Site | Alternative to Sheets |

**TinyML path (advanced):** train a model → deploy to the ESP32 → classify caps at the box in real time.

---

# PART 5: THE "PREDICTIVE PROCUREMENT" USE CASE
*(This is the original project's goal — forecast material/supply needs.)*

**Business question:** "How much plastic will we have next month, and what should we make?"
**Build:**
1. Forecast collection (Project 3).
2. Convert forecast → expected products (yield %).
3. Match to demand (sales data).
4. Output a **production plan**: "Next month: make 60 coasters, 20 keychains."
**Impact:** no overproduction, no stockouts, better use of time.

---

# PART 6: DATA ETHICS & PRIVACY (Teach it every time)
- **Anonymize:** no student names in datasets — use IDs.
- **Consent:** per `15_FORMS_...` data-privacy form.
- **Bias:** if your photos are all one cap type, your model is biased.
- **Transparency:** explain how the model decides.
- **Accuracy over hype:** report error, don't over-claim.
- **Privacy:** respect the platform's terms (COPPA/FERPA for schools).

**Class discussion:** "An AI says a cap is PP but it's HDPE. Who is responsible?"

---

# PART 7: CAPSTONE PROJECT RUBRIC (9-12)
| Criterion | 4 (Exceeds) | 3 (Meets) | 2 (Approaching) | 1 (Beginning) |
|-----------|-------------|-----------|------------------|---------------|
| Question | Sharp, relevant | Clear | Vague | Missing |
| Data | Clean, sufficient, own | Adequate | Messy | Insufficient |
| Method | Appropriate + justified | Appropriate | Partial | Wrong |
| Analysis | Insightful, checks bias | Correct | Some errors | Incorrect |
| Communication | Compelling, visual | Clear | Unclear | Missing |
| Ethics | Thoughtful | Considered | Minimal | Ignored |
| Impact | Real action taken | Recommendation | Idea only | None |

---

# PART 8: CAREER CONNECTIONS
Map these projects to real jobs:
- Data Analyst, Data Scientist
- ML Engineer, AI Researcher
- Sustainability/ESG Analyst
- Process/Industrial Engineer
- Product Manager
- Environmental Scientist

**Add to college apps / portfolios** with real metrics: "Built a model forecasting cap collection with 90% weekly accuracy."

---

# PART 9: 8-WEEK MINI-UNIT OUTLINE (Grades 9-12)
| Week | Topic | Output |
|------|-------|--------|
| 1 | What is data? Our dataset | Data dictionary |
| 2 | Describe & visualize | Charts + summary |
| 3 | Correlation | Findings |
| 4 | Intro to regression | Fitted line |
| 5 | Forecasting | 4-week forecast |
| 6 | Classification basics | Concept + demo |
| 7 | Ethics & bias | Debate + write-up |
| 8 | Capstone presentations | Portfolio entry |

---
*Data & AI Extension Guide v1.0 — the program generates data; the data generates scientists.*
