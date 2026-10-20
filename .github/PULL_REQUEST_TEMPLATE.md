name: Pull Request Template
description: Standard PR template for Cap Collective
title: "[Type]: Brief Description"
body:
  - type: markdown
    attributes:
      value: |
        Thanks for contributing! Please fill out the sections below.

  - type: checkboxes
    id: type
    attributes:
      label: Type of Change
      options:
        - label: 🐛 Bug fix (non-breaking change fixing an issue)
        - label: ✨ New feature (non-breaking change adding functionality)
        - label: 💥 Breaking change (fix or feature causing existing functionality to change)
        - label: 📚 Documentation update
        - label: 🔧 CAD / Hardware design change
        - label: 💻 Firmware / IoT change
        - label: 🌐 Dashboard / Software change
        - label: 📊 Spreadsheet / Formula change
        - label: ♻️ Refactor / Code quality
        - label: 🧪 Test addition
        - label: 🔒 Security improvement

  - type: textarea
    id: description
    attributes:
      label: Description
      description: Clear description of changes and motivation
      placeholder: |
        This PR adds/fixes...
        Motivation: ...
    validations:
      required: true

  - type: textarea
    id: related
    attributes:
      label: Related Issues
      description: Link related issues (use "Fixes #123" to auto-close)
      placeholder: |
        Fixes #123
        Related to #456

  - type: textarea
    id: testing
    attributes:
      label: Testing Done
      description: How did you test these changes?
      placeholder: |
        - [ ] Markdown renders correctly (checked with markdown preview)
        - [ ] CAD exports valid DXF/STL (tested in OpenSCAD)
        - [ ] Firmware compiles (pio run -e esp32s3)
        - [ ] Dashboard builds (npm run build && npm run lint)
        - [ ] CSV formulas verified in Google Sheets
        - [ ] Tested on actual hardware (specify device)
        - [ ] Tested with students/teachers (describe)
    validations:
      required: true

  - type: textarea
    id: screenshots
    attributes:
      label: Screenshots / Visual Proof
      description: For UI, CAD, or documentation changes, add before/after screenshots
      placeholder: Drag and drop images here or paste screenshots

  - type: dropdown
    id: breaking
    attributes:
      label: Breaking Changes?
      options:
        - No
        - Yes (describe in description)
      default: 0

  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      options:
        - label: My code follows the project's style guidelines
          required: true
        - label: I have performed a self-review of my changes
          required: true
        - label: I have commented complex code/design decisions
          required: true
        - label: I have updated documentation (CHANGELOG.md, relevant .md files)
          required: true
        - label: My changes generate no new warnings/errors
          required: true
        - label: I have added/updated tests where applicable
          required: true
        - label: I have added myself to CONTRIBUTORS.md (if first contribution)
          required: false
