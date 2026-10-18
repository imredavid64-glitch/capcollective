# Cap Collective — Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.0.0] - 2024-10-18

### 🚀 Features
- Complete Cap Collective School Implementation Kit v1.0
- 33 comprehensive markdown documents covering all aspects of the program
- Launch Deck (30 slides) with three audience tracks (K-5, 6-8, 9-12)
- Teacher Implementation Guide (8 chapters, ~50 pages equivalent)
- Command Center Google Sheets (8 tabs with auto-formulas)
- Safety SOPs & Risk Assessment for all machines
- 12 Full Lesson Plans across 4 grade bands (K-2, 3-5, 6-8, 9-12)
- Student Role Cards & Scheduling (7 rotating roles)
- Grant & Fundraising Templates (4 grants + 5 outreach scripts)
- Procurement, Payment & Finance Playbook
- Equipment & CAD Index with parametric OpenSCAD designs
- Printable Resources (posters, signs, log sheets, badges)
- Certification & Training Pack with quizzes and certificates
- Launch Week & Communications Kit (run-of-show + templates)
- Eco-Store Operations Manual
- Impact Reporting Templates (monthly/semester/annual)
- Engagement & Gamification Guide
- Accessibility & Inclusion Guide
- District Scale & Replication Guide
- Continuity & Handover Guide
- Data Science & AI Extension Guide
- IoT & Live Tracking Guide
- Supplier & Partner Directory
- Train-the-Trainer & Ambassador Program
- Digital Products & Online Store Guide

### 🔧 Hardware / CAD
- Parametric Collection Box (laser-cut flat panels, DXF export)
- Coaster Heat-Press Frame (2x2 cavity, 90mm coasters)
- Keychain Mold (injection molding ready)
- All CAD in OpenSCAD (.scad) with configurable parameters

### 💻 Firmware / IoT
- Node 1: ESP32-S3 CAM + Ultrasonic + Color Detection → ESP-NOW
- Node 2: ESP32 + IR Beam-Break / Ultrasonic → ESP-NOW
- Radio Tower: ESP32-S3 + TFT + OLED + SD + Camera → WiFi → Supabase
- ESP-NOW mesh communication (2.4 GHz, channel configurable)
- Camera-based access control (skin detection) for Radio Tower
- SD card logging (CSV) + Supabase real-time sync
- PlatformIO configuration for all nodes

### 🌐 Dashboard / Software
- Next.js 14 + TypeScript + Tailwind CSS dashboard
- React components: StatCard, CollectionChart, ProductMixChart, Leaderboard, SensorStatus
- Recharts visualizations
- Supabase PostgreSQL backend with realtime subscriptions
- Vercel/Netlify deployment ready
- Docker multi-stage build support

### 📊 Spreadsheets / Data
- 6 Importable CSV templates for Command Center tabs
- Collection Tracker, Equipment Procurement, Student Roles, Product Inventory, Impact Dashboard, Sensor Data Log
- All formulas and conditional formatting documented

### 📚 Documentation
- Comprehensive README with quick-start guides for all audiences
- Master Plan document with Google API integration plan
- Program Overview with grade-band differentiation
- Implementation Readiness Audit
- Firmware & IoT Integration Guide
- Website & Dashboard Deployment Guide

### 🔒 Security
- SECURITY.md with vulnerability reporting process
- Student data privacy considerations (FERPA, COPPA, GDPR)
- IoT device security model (local ESP-NOW, single WiFi gateway)
- Supabase Row Level Security policies

### ♻️ Refactoring / Maintenance
- Organized file structure with numbered prefixes for teaching sequence
- Consistent markdown formatting across all documents
- CSV files in dedicated `csv/` directory
- CAD files in dedicated `cad/` directory
- Firmware organized by node in `firmware/` directory
- Dashboard in `cap-collective-dashboard/` with full Next.js structure

### 🧪 Tests
- GitHub Actions CI pipeline with:
  - Markdown linting (markdownlint)
  - Link checking (markdown-link-check)
  - Spell checking (cspell)
  - Dashboard build + lint + typecheck
  - Firmware compile check (PlatformIO)
  - CAD syntax validation (OpenSCAD)
  - CSV structure validation

### 📦 Open Source Infrastructure
- MIT License
- CONTRIBUTING.md with detailed guidelines
- CODE_OF_CONDUCT.md (Contributor Covenant v2.1)
- GitHub Issue Templates (bug, feature, documentation)
- Pull Request Template
- GitHub Actions CI/CD workflow
- Dependabot configuration
- GitHub Sponsors / FUNDING.yml
- Release automation with changelog generation

---

## [Unreleased]

### Planned for v1.1.0
- [ ] Spanish translation of core documents
- [ ] French translation of core documents
- [ ] Mobile app for data collection (React Native / Expo)
- [ ] Additional CAD designs: plant pot mold, tile mold, filament extruder
- [ ] Advanced dashboard: predictive analytics, ML-based collection forecasting
- [ ] Automated Google Slides/Docs/Sheets creation via API
- [ ] Teacher PD video library (substitute-ready)
- [ ] District admin dashboard (multi-school view)
- [ ] Integration with Google Classroom / Canvas LMS
- [ ] Accessibility audit of dashboard (WCAG 2.1 AA)

### Planned for v1.2.0
- [ ] Multi-language firmware menus
- [ ] Solar-powered collection box variant
- [ ] Micro:bit version for younger grades (no soldering)
- [ ] Curriculum mappings for additional national standards (UK, AU, CA, EU)
- [ ] Grant template library expansion (EU Horizon, NSF, local foundations)
- [ ] Corporate partnership CRM template
- [ ] Student portfolio export (for college applications)

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| 1.0.0 | 2024-10-18 | Initial release - Complete School Implementation Kit |

---

## Release Process

1. Update version in `package.json` (dashboard) and tag: `git tag v1.x.x`
2. GitHub Actions automatically:
   - Runs full CI pipeline
   - Generates CHANGELOG from commits
   - Creates GitHub Release with assets
   - Deploys dashboard preview
3. Manual: Announce on Discord, update website, email newsletter

---

*For older changes, see git history: `git log --oneline --all`*