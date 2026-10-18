#!/usr/bin/env python3
"""
Sync root markdown files to docs/ folder for MkDocs site.
Creates missing files and updates existing ones.
"""

import os
import re
import shutil

ROOT = r"C:\Users\david\Desktop\Cap Collective"
DOCS = os.path.join(ROOT, "docs")

# Mapping: root file -> docs destination
SYNC_MAP = {
    # Getting Started
    "07_ADMIN_QUICKSTART_CHECKLIST.md": "getting-started/admin-checklist.md",
    "00_IMPLEMENTATION_READINESS_AUDIT.md": "getting-started/readiness-audit.md",  # already exists but update
    "README.md#budget-tiers": "getting-started/budget-tiers.md",  # extract section

    # Program
    "OVERVIEW.md": "program/overview.md",  # already exists but update
    "README.md#process": "program/process.md",  # extract
    "README.md#grade-bands": "program/grade-bands.md",  # extract
    "04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md": "program/safety.md",  # already exists but update

    # Implementation
    "02_TEACHER_IMPLEMENTATION_GUIDE.md": "implementation/teacher-guide.md",  # already exists but update
    "19_LAUNCH_WEEK_AND_COMMUNICATIONS_KIT.md": "implementation/launch-week.md",  # already exists but update
    "02_TEACHER_IMPLEMENTATION_GUIDE.md#chapter3": "implementation/operations.md",  # extract Ch3
    "03_COMMAND_CENTER_SHEETS.md": "implementation/command-center.md",  # already exists but update
    "09_STUDENT_ROLE_CARDS_AND_SCHEDULING.md": "implementation/student-roles.md",  # already exists but update

    # Curriculum
    "06_CURRICULUM_STANDARDS_MAPPING.md": "curriculum/standards.md",  # already exists but update
    "18_LESSON_PLAN_LIBRARY.md": "curriculum/lesson-plans.md",  # already exists but update
    "20_STUDENT_WORKSHEETS_PACK.md": "curriculum/worksheets.md",  # already exists but update
    "17_CERTIFICATION_AND_TRAINING_PACK.md": "curriculum/certification.md",  # already exists but update

    # Business
    "10_PRODUCT_DEVELOPMENT_AND_QC.md": "business/product-development.md",  # already exists but update
    "21_ECO_STORE_OPERATIONS_MANUAL.md": "business/eco-store.md",  # MISSING
    "32_DIGITAL_PRODUCTS_AND_ONLINE_STORE.md": "business/digital-products.md",  # MISSING
    "08_GRANT_AND_FUNDRAISING_TEMPLATES.md": "business/grants.md",  # MISSING

    # Technical
    "29_IOT_AND_LIVE_TRACKING.md": "technical/iot.md",  # MISSING
    "FIRMWARE_AND_IOT_GUIDE.md": "technical/firmware.md",  # MISSING
    "16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md": "technical/dashboard.md",  # MISSING
    "14_ASSET_CAD_AND_TOOLS_INDEX.md": "technical/cad.md",  # MISSING
    "cap-collective-dashboard/supabase_schema.sql": "technical/supabase.md",  # MISSING

    # Scaling
    "26_DISTRICT_SCALE_AND_REPLICATION_GUIDE.md": "scaling/district.md",  # MISSING
    "27_CONTINUITY_AND_HANDOVER_GUIDE.md": "scaling/continuity.md",  # MISSING
    "31_TRAIN_THE_TRAINER_AND_AMBASSADOR_PROGRAM.md": "scaling/train-trainer.md",  # MISSING

    # Resources
    "05_PRINTABLE_RESOURCES.md": "resources/printables.md",  # MISSING
    "15_FORMS_AND_PERMISSIONS_PACK.md": "resources/forms.md",  # MISSING
    "30_SUPPLIER_AND_PARTNER_DIRECTORY.md": "resources/suppliers.md",  # MISSING
    "02_TEACHER_IMPLEMENTATION_GUIDE.md#appendix": "resources/faq.md",  # MISSING
}

def extract_section(content, section_marker, end_marker=None):
    """Extract a section from markdown between markers."""
    lines = content.split('\n')
    in_section = False
    result = []
    for line in lines:
        if section_marker in line:
            in_section = True
            continue
        if in_section and end_marker and end_marker in line:
            break
        if in_section:
            result.append(line)
    return '\n'.join(result).strip()

def clean_content(content, source_file):
    """Clean up content for docs site."""
    # Fix internal links
    content = re.sub(r'\]\(([0-9]{2}_[^)]+\.md)', r'](../\1)', content)
    content = re.sub(r'\]\(([0-9]{2}_[^)]+\.md#([^)]+))', r'](../\1#\2)', content)
    content = re.sub(r'\]\((csv/[^)]+)\)', r'](../../\1)', content)
    content = re.sub(r'\]\((cad/[^)]+)\)', r'](../../\1)', content)
    content = re.sub(r'\]\((firmware/[^)]+)\)', r'](../../\1)', content)
    content = re.sub(r'\]\((cap-collective-dashboard/[^)]+)\)', r'](../../\1)', content)
    content = re.sub(r'\]\((resources/[^)]+)\)', r'](../../\1)', content)
    
    # Fix absolute github links to relative
    content = re.sub(r'\]\(https://github\.com/imredavid64-glitch/capcollective/blob/main/([^)]+)\)', r'](../\1)', content)
    
    # Remove emoji that might not render well
    return content

def convert_teacher_guide_full(source_path, dest_path):
    """Convert full teacher guide to docs format with proper structure."""
    with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Add frontmatter
    frontmatter = "---\ntitle: Teacher Implementation Guide\ndescription: Complete 8-chapter playbook for running Cap Collective\n---\n\n"
    
    # Clean and write
    content = clean_content(content, source_path)
    content = frontmatter + content
    
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content)

def convert_safety_guide(source_path, dest_path):
    """Convert safety guide to docs format."""
    with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    frontmatter = "---\ntitle: Safety SOPs & Risk Assessment\ndescription: Standard operating procedures for all machines and processes\n---\n\n"
    content = clean_content(content, source_path)
    content = frontmatter + content
    
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content)

def convert_simple(source_path, dest_path, title=None):
    """Simple conversion with frontmatter."""
    with open(source_path, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    if not title:
        title = os.path.basename(source_path).replace('.md', '').replace('_', ' ').title()
    
    frontmatter = f"---\ntitle: {title}\n---\n\n"
    content = clean_content(content, source_path)
    content = frontmatter + content
    
    os.makedirs(os.path.dirname(dest_path), exist_ok=True)
    with open(dest_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    print("Syncing root markdown to docs/...")
    
    # 1. Full Teacher Guide
    print("  Converting Teacher Guide...")
    convert_teacher_guide_full(
        os.path.join(ROOT, "02_TEACHER_IMPLEMENTATION_GUIDE.md"),
        os.path.join(DOCS, "implementation/teacher-guide.md")
    )
    
    # 2. Full Safety Guide
    print("  Converting Safety Guide...")
    convert_safety_guide(
        os.path.join(ROOT, "04_SAFETY_SOPS_AND_RISK_ASSESSMENT.md"),
        os.path.join(DOCS, "program/safety.md")
    )
    
    # Pre-read Teacher Guide for extractions
    with open(os.path.join(ROOT, "02_TEACHER_IMPLEMENTATION_GUIDE.md"), 'r', encoding='utf-8', errors='ignore') as f:
        tg = f.read()
    
    # 3. Full Command Center
    print("  Converting Command Center...")
    convert_simple(
        os.path.join(ROOT, "03_COMMAND_CENTER_SHEETS.md"),
        os.path.join(DOCS, "implementation/command-center.md"),
        "Command Center Workbook"
    )
    
    # 4. Student Roles
    print("  Converting Student Roles...")
    convert_simple(
        os.path.join(ROOT, "09_STUDENT_ROLE_CARDS_AND_SCHEDULING.md"),
        os.path.join(DOCS, "implementation/student-roles.md"),
        "Student Roles & Scheduling"
    )
    
    # 5. Launch Week
    print("  Converting Launch Week...")
    convert_simple(
        os.path.join(ROOT, "19_LAUNCH_WEEK_AND_COMMUNICATIONS_KIT.md"),
        os.path.join(DOCS, "implementation/launch-week.md"),
        "Launch Week & Communications Kit"
    )
    
    # 6. Curriculum Standards
    print("  Converting Curriculum Standards...")
    convert_simple(
        os.path.join(ROOT, "06_CURRICULUM_STANDARDS_MAPPING.md"),
        os.path.join(DOCS, "curriculum/standards.md"),
        "Curriculum Standards Mapping"
    )
    
    # 7. Lesson Plans
    print("  Converting Lesson Plans...")
    convert_simple(
        os.path.join(ROOT, "18_LESSON_PLAN_LIBRARY.md"),
        os.path.join(DOCS, "curriculum/lesson-plans.md"),
        "Lesson Plan Library"
    )
    
    # 8. Student Worksheets
    print("  Converting Student Worksheets...")
    convert_simple(
        os.path.join(ROOT, "20_STUDENT_WORKSHEETS_PACK.md"),
        os.path.join(DOCS, "curriculum/worksheets.md"),
        "Student Worksheets Pack"
    )
    
    # 9. Certification
    print("  Converting Certification...")
    convert_simple(
        os.path.join(ROOT, "17_CERTIFICATION_AND_TRAINING_PACK.md"),
        os.path.join(DOCS, "curriculum/certification.md"),
        "Certification & Training Pack"
    )
    
    # 10. Product Development
    print("  Converting Product Development...")
    convert_simple(
        os.path.join(ROOT, "10_PRODUCT_DEVELOPMENT_AND_QC.md"),
        os.path.join(DOCS, "business/product-development.md"),
        "Product Development & QC"
    )
    
    # 11. Eco-Store (NEW)
    print("  Converting Eco-Store...")
    convert_simple(
        os.path.join(ROOT, "21_ECO_STORE_OPERATIONS_MANUAL.md"),
        os.path.join(DOCS, "business/eco-store.md"),
        "Eco-Store Operations Manual"
    )
    
    # 12. Digital Products (NEW)
    print("  Converting Digital Products...")
    convert_simple(
        os.path.join(ROOT, "32_DIGITAL_PRODUCTS_AND_ONLINE_STORE.md"),
        os.path.join(DOCS, "business/digital-products.md"),
        "Digital Products & Online Store"
    )
    
    # 13. Grants (NEW)
    print("  Converting Grant Templates...")
    convert_simple(
        os.path.join(ROOT, "08_GRANT_AND_FUNDRAISING_TEMPLATES.md"),
        os.path.join(DOCS, "business/grants.md"),
        "Grant & Fundraising Templates"
    )
    
    # 14. IoT (NEW)
    print("  Converting IoT Guide...")
    convert_simple(
        os.path.join(ROOT, "29_IOT_AND_LIVE_TRACKING.md"),
        os.path.join(DOCS, "technical/iot.md"),
        "IoT & Live Tracking"
    )
    
    # 15. Firmware (NEW)
    print("  Converting Firmware Guide...")
    convert_simple(
        os.path.join(ROOT, "FIRMWARE_AND_IOT_GUIDE.md"),
        os.path.join(DOCS, "technical/firmware.md"),
        "Firmware & IoT Guide"
    )
    
    # 16. Dashboard Deployment (NEW)
    print("  Converting Dashboard Deployment...")
    convert_simple(
        os.path.join(ROOT, "16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md"),
        os.path.join(DOCS, "technical/dashboard.md"),
        "Dashboard Deployment"
    )
    
    # 17. CAD (NEW)
    print("  Converting CAD Index...")
    convert_simple(
        os.path.join(ROOT, "14_ASSET_CAD_AND_TOOLS_INDEX.md"),
        os.path.join(DOCS, "technical/cad.md"),
        "CAD Designs & Tools"
    )
    
    # 18. Supabase Schema (NEW)
    print("  Converting Supabase Schema...")
    with open(os.path.join(ROOT, "cap-collective-dashboard", "supabase_schema.sql"), 'r') as f:
        sql = f.read()
    content = f"# Supabase Schema\n\nComplete PostgreSQL schema for Cap Collective dashboard.\n\n```sql\n{sql}\n```"
    os.makedirs(os.path.join(DOCS, "technical"), exist_ok=True)
    with open(os.path.join(DOCS, "technical/supabase.md"), 'w') as f:
        f.write(content)
    
    # 19. District Scaling (NEW)
    print("  Converting District Scaling...")
    convert_simple(
        os.path.join(ROOT, "26_DISTRICT_SCALE_AND_REPLICATION_GUIDE.md"),
        os.path.join(DOCS, "scaling/district.md"),
        "District Scale & Replication"
    )
    
    # 20. Continuity (NEW)
    print("  Converting Continuity Guide...")
    convert_simple(
        os.path.join(ROOT, "27_CONTINUITY_AND_HANDOVER_GUIDE.md"),
        os.path.join(DOCS, "scaling/continuity.md"),
        "Continuity & Handover"
    )
    
    # 21. Train the Trainer (NEW)
    print("  Converting Train-the-Trainer...")
    convert_simple(
        os.path.join(ROOT, "31_TRAIN_THE_TRAINER_AND_AMBASSADOR_PROGRAM.md"),
        os.path.join(DOCS, "scaling/train-trainer.md"),
        "Train-the-Trainer & Ambassador Program"
    )
    
    # 22. Printables (NEW)
    print("  Converting Printables...")
    convert_simple(
        os.path.join(ROOT, "05_PRINTABLE_RESOURCES.md"),
        os.path.join(DOCS, "resources/printables.md"),
        "Printable Resources"
    )
    
    # 23. Forms (NEW)
    print("  Converting Forms & Permissions...")
    convert_simple(
        os.path.join(ROOT, "15_FORMS_AND_PERMISSIONS_PACK.md"),
        os.path.join(DOCS, "resources/forms.md"),
        "Forms & Permissions Pack"
    )
    
    # 24. Suppliers (NEW)
    print("  Converting Supplier Directory...")
    convert_simple(
        os.path.join(ROOT, "30_SUPPLIER_AND_PARTNER_DIRECTORY.md"),
        os.path.join(DOCS, "resources/suppliers.md"),
        "Supplier & Partner Directory"
    )
    
    # 25. FAQ (NEW - extract from Teacher Guide appendix)
    print("  Creating FAQ...")
    faq_content = extract_section(tg, "## Appendix E: Troubleshooting FAQ", "## Appendix")
    if not faq_content:
        faq_content = "# FAQ & Troubleshooting\n\nSee the [Teacher Guide](../implementation/teacher-guide.md#appendix-e-troubleshooting-faq) for the full FAQ."
    os.makedirs(os.path.join(DOCS, "resources"), exist_ok=True)
    with open(os.path.join(DOCS, "resources/faq.md"), 'w', encoding='utf-8') as f:
        f.write(f"---\ntitle: FAQ & Troubleshooting\n---\n\n{faq_content}")
    
    # 26. Admin Checklist (NEW)
    print("  Converting Admin Checklist...")
    convert_simple(
        os.path.join(ROOT, "07_ADMIN_QUICKSTART_CHECKLIST.md"),
        os.path.join(DOCS, "getting-started/admin-checklist.md"),
        "Admin Quick-Start Checklist"
    )
    
    # 27. Budget Tiers (extract from README)
    print("  Creating Budget Tiers page...")
    with open(os.path.join(ROOT, "README.md"), 'r', encoding='utf-8', errors='ignore') as f:
        readme = f.read()
    budget_content = extract_section(readme, "## BUDGET TIERS", "## ")
    if not budget_content:
        budget_content = extract_section(readme, "## 💰 BUDGET TIERS", "## ")
    os.makedirs(os.path.join(DOCS, "getting-started"), exist_ok=True)
    with open(os.path.join(DOCS, "getting-started/budget-tiers.md"), 'w') as f:
        f.write(f"---\ntitle: Budget Tiers\n---\n\n{budget_content}")
    
    # 28. Program Overview (full)
    print("  Converting Program Overview...")
    convert_simple(
        os.path.join(ROOT, "OVERVIEW.md"),
        os.path.join(DOCS, "program/overview.md"),
        "Program Overview"
    )
    
    # 29. Process (extract from README)
    print("  Creating Process page...")
    process_content = extract_section(readme, "## THE 5-STEP PROCESS", "## ")
    if not process_content:
        process_content = extract_section(readme, "## 📋 THE 5-STEP PROCESS", "## ")
    with open(os.path.join(DOCS, "program/process.md"), 'w') as f:
        f.write(f"---\ntitle: The 5-Step Process\n---\n\n{process_content}")
    
    # 30. Grade Bands (extract from README)
    print("  Creating Grade Bands page...")
    grade_content = extract_section(readme, "## GRADE-BAND PROGRAMS", "## ")
    if not grade_content:
        grade_content = extract_section(readme, "## 🎓 GRADE-BAND PROGRAMS", "## ")
    with open(os.path.join(DOCS, "program/grade-bands.md"), 'w') as f:
        f.write(f"---\ntitle: Grade-Band Programs\n---\n\n{grade_content}")
    
    # 31. Operations Playbook (extract Chapter 3 from Teacher Guide)
    print("  Creating Operations Playbook...")
    ops_content = extract_section(tg, "## CHAPTER 3: OPERATIONS PLAYBOOK", "## CHAPTER 4")
    with open(os.path.join(DOCS, "implementation/operations.md"), 'w') as f:
        f.write(f"---\ntitle: Operations Playbook\n---\n\n{ops_content}")
    
    print("\n[OK] Sync complete!")
    print(f"Generated docs in {DOCS}")

if __name__ == "__main__":
    main()