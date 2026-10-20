# Contributing to Cap Collective

Thank you for your interest in contributing to Cap Collective! This project is a complete K-12 circular economy program where students turn bottle caps into valuable products. We welcome contributions from educators, makers, engineers, designers, and students.

## Ways to Contribute

### 📚 Documentation & Curriculum
- Improve lesson plans, worksheets, or teacher guides
- Add curriculum mappings for new standards (state, national, IB)
- Translate materials to other languages
- Create video tutorials or visual guides

### 🔧 Hardware & CAD
- Improve parametric CAD designs (collection boxes, molds, press frames)
- Add new product designs (keychains, organizers, tiles, etc.)
- Optimize for different laser cutters / CNC machines
- Document regional material suppliers

### 💻 Software & IoT
- Improve ESP32/ESP32-S3 firmware (Node 1, Node 2, Radio Tower)
- Enhance the Next.js dashboard (cap-collective-dashboard)
- Add Supabase schema improvements
- Create mobile app for data collection

### 💰 Finance & Operations
- Add regional grant templates
- Improve procurement spreadsheets with local suppliers
- Create new budget tier configurations
- Document fundraising strategies

### 🌍 Accessibility & Inclusion
- Improve accessibility guides
- Adapt activities for different abilities
- Create multilingual resources
- Design low-cost alternatives for underserved schools

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/capcollective.git
   cd capcollective
   ```
3. **Create a branch** for your changes:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Make your changes** following the guidelines below
5. **Test your changes** locally
6. **Submit a Pull Request** with a clear description

## Contribution Guidelines

### Markdown Documentation
- Use clear, concise language appropriate for educators
- Follow the existing heading structure (H1 for document title, H2 for chapters, H3 for sections)
- Include practical examples and "Do This Now" checklists
- Reference standards codes (NGSS, Common Core, IB) where applicable
- Keep line length reasonable for readability

### CAD Files (OpenSCAD)
- Use parametric design with clear variable names at the top
- Include comments explaining dimensions and assembly
- Export DXF/STL examples in a `exports/` folder
- Test with OpenSCAD nightly before submitting

### Firmware (Arduino/PlatformIO)
- Target ESP32/ESP32-S3 with Arduino framework
- Use PlatformIO for dependency management
- Comment all pin definitions and configuration options
- Include wiring diagrams in markdown
- Test on actual hardware when possible

### Dashboard (Next.js/TypeScript)
- Follow the existing component structure
- Use TypeScript with strict mode
- Components in `src/components/` organized by feature
- Tailwind CSS for styling
- Recharts for data visualization
- Test with `npm run build` and `npm run lint`

### Spreadsheets (CSV/Google Sheets)
- Provide CSV files in the `csv/` directory
- Document all formulas and conditional formatting in markdown
- Include sample data rows
- Make currency/configurable values obvious

## Code of Conduct

This project follows our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.

## Pull Request Process

1. **Update documentation** - Ensure any changed functionality is documented
2. **Add tests** - For code changes, add/update tests
3. **Update CHANGELOG.md** - Add your changes under the appropriate section
4. **Link issues** - Reference any related issues in the PR description
5. **Screenshots** - For UI changes, include before/after screenshots
6. **Review** - At least one maintainer must approve before merge

### PR Title Format
```
[type]: Brief description

Types: feat, fix, docs, cad, firmware, dashboard, spreadsheet, config, chore
```

Examples:
- `feat: Add Spanish translation for teacher guide`
- `fix: Correct temperature calculation in firmware`
- `cad: New parametric keychain mold design`
- `docs: Update grant template for EU Erasmus+`

## Development Setup

### Documentation Only
No special setup needed - edit `.md` files directly.

### CAD Development
```bash
# Install OpenSCAD
# Open .scad files and press F5 to preview, F6 to render
```

### Firmware Development
```bash
# Install PlatformIO (VS Code extension recommended)
cd firmware/node1_cap_counter
pio run -t upload  # Flash to device
```

### Dashboard Development
```bash
cd cap-collective-dashboard
npm install
npm run dev  # Runs on localhost:3000
```

### Supabase Setup
```bash
# See 16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md for full setup
# Create Supabase project, run migrations from supabase/
```

## Testing Checklist

Before submitting a PR, verify:
- [ ] Markdown renders correctly (no broken links, images load)
- [ ] CAD exports valid DXF/STL without errors
- [ ] Firmware compiles for target board (PlatformIO check)
- [ ] Dashboard builds without TypeScript errors (`npm run build`)
- [ ] Dashboard linting passes (`npm run lint`)
- [ ] CSV files open correctly in Google Sheets/Excel
- [ ] Formulas in spreadsheet docs are accurate
- [ ] New content follows existing style and tone

## Recognition

Contributors will be recognized in:
- `CONTRIBUTORS.md` (add yourself in your PR)
- Release notes for significant contributions
- Project README contributors section
- Annual "Cap Collective Champions" blog post

## Questions?

- Open a [GitHub Discussion](https://github.com/imredavid64-glitch/capcollective/discussions)
- Join our [Discord community](https://discord.gg/capcollective) (link in README)
- Email: [maintainer email]

---

**Thank you for helping bring circular economy education to schools worldwide!** 🌍♻️
