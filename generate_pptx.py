#!/usr/bin/env python3
"""
Cap Collective PPTX Generator
Generates PowerPoint presentations from markdown content.
"""

from pptx import Presentation
from pptx.util import Inches, Pt, Emu
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
import re
import os

# Cap Collective Brand Colors
COLORS = {
    'dark_green': RGBColor(0x1B, 0x5E, 0x20),      # #1B5E20
    'medium_green': RGBColor(0x2E, 0x7D, 0x32),    # #2E7D32
    'light_green': RGBColor(0xA5, 0xD6, 0xA7),     # #A5D6A7
    'pale_green': RGBColor(0xE8, 0xF5, 0xE9),      # #E8F5E9
    'white': RGBColor(0xFF, 0xFF, 0xFF),
    'black': RGBColor(0x00, 0x00, 0x00),
    'dark_gray': RGBColor(0x33, 0x33, 0x33),
    'medium_gray': RGBColor(0x66, 0x66, 0x66),
    'light_gray': RGBColor(0xF5, 0xF5, 0xF5),
    'accent_orange': RGBColor(0xFF, 0x98, 0x00),    # #FF9800
    'accent_blue': RGBColor(0x19, 0x76, 0xD2),      # #1976D2
    'accent_red': RGBColor(0xD3, 0x2F, 0x2F),       # #D32F2F
    'accent_yellow': RGBColor(0xFF, 0xEB, 0x3B),    # #FFEB3B
}

def add_background(slide, color):
    """Add solid background to slide"""
    background = slide.background
    fill = background.fill
    fill.solid()
    fill.fore_color.rgb = color

def add_shape_bg(slide, left, top, width, height, color, transparency=0):
    """Add a colored rectangle shape"""
    shape = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, left, top, width, height)
    shape.fill.solid()
    shape.fill.fore_color.rgb = color
    shape.line.fill.background()
    return shape

def add_text_box(slide, left, top, width, height, text, font_size=18, bold=False, color=None, alignment=PP_ALIGN.LEFT, font_name='Calibri'):
    """Add a text box with formatting"""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    p = tf.paragraphs[0]
    p.text = text
    p.font.size = Pt(font_size)
    p.font.bold = bold
    p.font.name = font_name
    p.alignment = alignment
    if color:
        p.font.color.rgb = color
    return txBox

def add_bullet_slide(slide, left, top, width, height, items, font_size=16, color=None, bold_first=False, spacing=Pt(6)):
    """Add bulleted list"""
    txBox = slide.shapes.add_textbox(left, top, width, height)
    tf = txBox.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        if i == 0:
            p = tf.paragraphs[0]
        else:
            p = tf.add_paragraph()
        p.text = item
        p.font.size = Pt(font_size)
        p.font.name = 'Calibri'
        p.space_after = spacing
        if color:
            p.font.color.rgb = color
        if bold_first and i == 0:
            p.font.bold = True
        p.level = 0
    return txBox

def add_table(slide, left, top, width, height, rows, cols, data, header_color=None, font_size=12):
    """Add a formatted table"""
    table_shape = slide.shapes.add_table(rows, cols, left, top, width, height)
    table = table_shape.table
    
    for row_idx, row_data in enumerate(data):
        for col_idx, cell_text in enumerate(row_data):
            cell = table.cell(row_idx, col_idx)
            cell.text = str(cell_text)
            for paragraph in cell.text_frame.paragraphs:
                paragraph.font.size = Pt(font_size)
                paragraph.font.name = 'Calibri'
                if row_idx == 0 and header_color:
                    paragraph.font.bold = True
                    paragraph.font.color.rgb = COLORS['white']
                else:
                    paragraph.font.color.rgb = COLORS['dark_gray']
            
            # Header row styling
            if row_idx == 0 and header_color:
                cell.fill.solid()
                cell.fill.fore_color.rgb = header_color
            elif row_idx % 2 == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLORS['pale_green']
            else:
                cell.fill.solid()
                cell.fill.fore_color.rgb = COLORS['white']
    
    # Set column widths (auto-distribute)
    return table_shape

def parse_launch_deck(markdown_content):
    """Parse the launch deck markdown into slide data"""
    slides = []
    current_slide = None
    
    lines = markdown_content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        
        # Slide header
        if line.startswith('## SLIDE'):
            if current_slide:
                slides.append(current_slide)
            # Extract slide number and title
            match = re.match(r'## SLIDE (\d+):\s*(.+)', line)
            if match:
                num = int(match.group(1))
                title = match.group(2)
            else:
                num = len(slides) + 1
                title = line.replace('## SLIDE', '').replace(':', '').strip()
            current_slide = {
                'number': num,
                'title': title,
                'content': [],
                'presenter_notes': '',
                'is_appendix': False
            }
        
        # Appendix slides
        elif line.startswith('## APPENDIX SLIDES') or line.startswith('## SPEAKER NOTES'):
            current_slide = None
        
        # Content lines
        elif current_slide and line:
            # Presenter notes
            if line.startswith('**Presenter Notes:**'):
                current_slide['presenter_notes'] = line.replace('**Presenter Notes:**', '').strip()
                # Collect multi-line notes
                j = i + 1
                while j < len(lines) and lines[j].strip() and not lines[j].strip().startswith('##') and not lines[j].strip().startswith('---'):
                    current_slide['presenter_notes'] += ' ' + lines[j].strip()
                    j += 1
                i = j - 1
            # Tables
            elif '|' in line and line.count('|') > 2:
                # Parse table
                table_lines = []
                j = i
                while j < len(lines) and '|' in lines[j] and lines[j].count('|') > 2:
                    table_lines.append(lines[j].strip())
                    j += 1
                if table_lines:
                    current_slide['content'].append(('table', table_lines))
                i = j - 1
            # Code blocks
            elif line.startswith('```'):
                code_lines = []
                j = i + 1
                while j < len(lines) and not lines[j].strip().startswith('```'):
                    code_lines.append(lines[j].rstrip())
                    j += 1
                current_slide['content'].append(('code', code_lines))
                i = j
            # Regular content
            elif not line.startswith('---'):
                current_slide['content'].append(('text', line))
        
        i += 1
    
    if current_slide:
        slides.append(current_slide)
    
    return slides

def create_launch_deck_pptx(slides, output_path):
    """Create the main Launch Deck PPTX"""
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    
    # Slide layouts
    title_slide_layout = prs.slide_layouts[0]  # Title slide
    blank_layout = prs.slide_layouts[6]  # Blank
    
    for slide_data in slides:
        if slide_data['number'] == 1:
            # Title slide
            slide = prs.slides.add_slide(title_slide_layout)
            add_background(slide, COLORS['dark_green'])
            
            # Title
            title_shape = slide.shapes.title
            title_shape.text = slide_data['title']
            title_shape.text_frame.paragraphs[0].font.size = Pt(44)
            title_shape.text_frame.paragraphs[0].font.color.rgb = COLORS['white']
            title_shape.text_frame.paragraphs[0].font.bold = True
            
            # Subtitle
            subtitle_shape = slide.placeholders[1]
            subtitle_shape.text = "From Bottle Caps to Community Impact — A Student-Led Innovation Program"
            subtitle_shape.text_frame.paragraphs[0].font.size = Pt(24)
            subtitle_shape.text_frame.paragraphs[0].font.color.rgb = COLORS['light_green']
            
            # Add decorative line
            add_shape_bg(slide, Inches(1), Inches(3.5), Inches(11.333), Pt(4), COLORS['accent_orange'])
            
            # Footer
            add_text_box(slide, Inches(1), Inches(6.5), Inches(11), Inches(0.5),
                        "Cap Collective — Open Source Circular Economy Education Kit",
                        font_size=14, color=COLORS['light_green'], alignment=PP_ALIGN.CENTER)
            
        else:
            # Content slides
            slide = prs.slides.add_slide(blank_layout)
            add_background(slide, COLORS['white'])
            
            # Top bar
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(1.1), COLORS['dark_green'])
            
            # Slide number
            add_text_box(slide, Inches(0.5), Inches(0.15), Inches(2), Inches(0.5),
                        f"Slide {slide_data['number']}", font_size=14, color=COLORS['light_green'], bold=True)
            
            # Title
            add_text_box(slide, Inches(0.8), Inches(0.2), Inches(11), Inches(0.7),
                        slide_data['title'], font_size=32, bold=True, color=COLORS['white'])
            
            # Content area
            y_pos = Inches(1.4)
            content_width = Inches(11.5)
            content_left = Inches(0.9)
            
            for content_type, content in slide_data['content']:
                if content_type == 'text':
                    # Check if it's a header
                    if content.startswith('**') and content.endswith('**'):
                        add_text_box(slide, content_left, y_pos, content_width, Inches(0.5),
                                    content.replace('**', ''), font_size=22, bold=True, color=COLORS['dark_green'])
                        y_pos += Inches(0.6)
                    elif content.startswith('- ') or content.startswith('• '):
                        # Bullet point
                        add_text_box(slide, content_left + Inches(0.3), y_pos, content_width - Inches(0.3), Inches(0.4),
                                    content[2:], font_size=16, color=COLORS['dark_gray'])
                        y_pos += Inches(0.35)
                    else:
                        # Regular text
                        add_text_box(slide, content_left, y_pos, content_width, Inches(0.5),
                                    content, font_size=16, color=COLORS['dark_gray'])
                        y_pos += Inches(0.45)
                
                elif content_type == 'table':
                    # Parse markdown table
                    rows = []
                    for table_line in content:
                        if table_line.startswith('|') and table_line.endswith('|'):
                            cells = [c.strip() for c in table_line.split('|')[1:-1]]
                            rows.append(cells)
                    
                    if rows:
                        # Remove separator row
                        rows = [r for r in rows if not all(re.match(r'^[-:\s]+$', c) for c in r)]
                        
                        if rows:
                            num_rows = len(rows)
                            num_cols = len(rows[0]) if rows else 0
                            table_height = Inches(0.4 * num_rows + 0.2)
                            
                            add_table(slide, content_left, y_pos, content_width, table_height,
                                    num_rows, num_cols, rows, header_color=COLORS['dark_green'], font_size=11)
                            y_pos += table_height + Inches(0.3)
                
                elif content_type == 'code':
                    # Code block
                    code_text = '\n'.join(content)
                    add_text_box(slide, content_left, y_pos, content_width, Inches(0.3 * len(content) + 0.2),
                                code_text, font_size=11, color=COLORS['dark_gray'], font_name='Consolas')
                    y_pos += Inches(0.3 * len(content) + 0.3)
            
            # Bottom bar with branding
            add_shape_bg(slide, Inches(0), Inches(7.0), Inches(13.333), Inches(0.5), COLORS['dark_green'])
            add_text_box(slide, Inches(0.5), Inches(7.05), Inches(6), Inches(0.4),
                        "Cap Collective — Join the Bridge. Create the Impact.",
                        font_size=12, color=COLORS['light_green'])
            add_text_box(slide, Inches(9), Inches(7.05), Inches(4), Inches(0.4),
                        f"Slide {slide_data['number']} of {len(slides)}",
                        font_size=12, color=COLORS['light_green'], alignment=PP_ALIGN.RIGHT)
            
            # Add presenter notes
            if slide_data['presenter_notes']:
                notes_slide = slide.notes_slide
                notes_slide.notes_text_frame.text = slide_data['presenter_notes']
    
    prs.save(output_path)
    print(f"Created {output_path} with {len(slides)} slides")

def create_teacher_pd_pptx(output_path):
    """Create Teacher PD Workshop PPTX from 22_TEACHER_PD_AND_ONBOARDING_GUIDE.md"""
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]
    
    slides_data = [
        {
            'title': 'Cap Collective Teacher Professional Development',
            'subtitle': '2-Hour Launch Workshop — Ready to Run Day 1',
            'type': 'title'
        },
        {
            'title': 'Workshop Agenda',
            'bullets': [
                'Welcome & Introductions (10 min)',
                'Program Overview: Why Cap Collective? (15 min)',
                'Safety Certification Walkthrough (30 min)',
                'Hands-On: Build Your First Collection Box (25 min)',
                'Break (10 min)',
                'Dashboard Setup & Data Walkthrough (20 min)',
                'Lesson Plan Deep Dive: Week 1-2 (20 min)',
                'Q&A, Resources, Next Steps (10 min)',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Why Cap Collective?',
            'bullets': [
                'Only 3% of bottle caps recycled globally — we fix this at the source',
                'Students run everything: collection, processing, sales, data, marketing',
                'Hits 15+ NGSS/Common Core/IB standards in one program',
                'Generates revenue ($500+/semester) to fund school garden/grants',
                'Builds leadership: every student rotates through 7 certified roles',
                'Scalable: Start at $500, grow to $10,000+ district hub',
            ],
            'type': 'bullets'
        },
        {
            'title': 'The 5-Step Process (Every Student Learns All Steps)',
            'bullets': [
                '1. COLLECT — HDPE #2 / PP #5 caps in campus boxes',
                '2. CLEAN — Remove liners, wash, air-dry 24 hours',
                '3. SHRED — 5-8mm uniform flakes (critical for quality)',
                '4. MELT — Heat press: HDPE 140°C / PP 170°C (never >200°C)',
                '5. REFINE — Laser cut / injection mold / 3D filament',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Safety First — Non-Negotiable Rules',
            'bullets': [
                '✅ No certification = no machine access. Ever.',
                '✅ One certified adult per 4 students at powered machines',
                '✅ Never exceed 200°C on any heating device',
                '✅ Ventilation ALWAYS on before heating plastic (100+ CFM)',
                '✅ PPE at all times: goggles, heat gloves (500°F), respirator (N95+), apron',
                '✅ Stop immediately if burning smell, smoke, or grinding noise',
                '✅ Hands NEVER in shredder hopper or press platen',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Student Roles — Leadership Rotates Quarterly',
            'table': [
                ['Role', 'Responsibility', 'Certification', 'Grades'],
                ['Collection Captain', 'Zone mapping, box monitoring, Friday pickup', 'Safety + Data Entry', '3+'],
                ['Wash Station Lead', 'Cleaning protocol, liner removal, drying logs', 'Hygiene + Material ID', '3+'],
                ['Shredder Operator', 'Feeding, sieving, flake quality check', 'Shredder Safety', '6+'],
                ['Press Operator', 'Temp monitoring, parchment sandwich, timing', 'Heat Press Safety', '6+'],
                ['Design Engineer', 'Fusion 360/Tinkercad, mold design, QC', 'Design Software', '6+'],
                ['Data Analyst', 'Dashboard maintenance, trend reports, alerts', 'Sheets/Arduino', '6+'],
                ['Business Manager', 'Inventory, pricing, sales, marketing', 'Financial Literacy', '9+'],
            ],
            'type': 'table'
        },
        {
            'title': '18-Week Implementation Timeline',
            'table': [
                ['Phase', 'Weeks', 'Key Activities', 'Milestone'],
                ['Launch', '1-2', 'Admin MOU, space prep, equipment order, student leads', 'Signed agreement, orders placed'],
                ['Build', '3-4', 'Build boxes, install sensors, safety certs, first collection', '5+ boxes live, dashboard active'],
                ['Process', '5-8', 'Weekly cycles: collect→wash→shred→press→finish', '500+ caps, first batch products'],
                ['Product', '9-12', 'Design sprint, mold making, QC, branding, packaging', '3+ product lines ready to sell'],
                ['Market', '13-15', 'Eco-store launch, community sale, impact report v1', '$500+ revenue, public report'],
                ['Scale', '16-18', 'Reflection, documentation, train next cohort, grant apps', 'Handoff guide, grant submitted'],
            ],
            'type': 'table'
        },
        {
            'title': 'Hands-On Activity: Build a Collection Box',
            'bullets': [
                'Materials: 5mm plywood (pre-cut from cad/collection_box.scad), wood glue, 4mm screws',
                'Assembly: Bottom → Front (with slot + window) → Back (IR sensor holes) → Left → Right → Lid',
                'Laser cut DXF from OpenSCAD: Top view (numpad 7) → Export → DXF',
                'Cost: ~$15-25 per box in materials',
                'Student activity: "Box Building Day" — sand, glue, assemble, decorate',
                'Deploy: 1 box per 150 students minimum, map high-traffic zones',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Dashboard Setup — Live Data in 10 Minutes',
            'bullets': [
                '1. Fork cap-collective-dashboard repo',
                '2. Create Supabase project (free tier)',
                '3. Run SQL schema from 16_WEBSITE_AND_DASHBOARD_DEPLOYMENT.md',
                '4. Add Supabase URL + Anon Key to Vercel environment variables',
                '5. Deploy to Vercel — auto-builds in 2 minutes',
                '6. Share dashboard URL with students for real-time tracking',
                '7. Optional: Connect ESP32 sensors via 29_IOT_AND_LIVE_TRACKING.md',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Curriculum Mapping — Standards-Aligned from Day 1',
            'bullets': [
                'K-2: K-ESS3-3 (reduce human impact), 2-PS1-1 (classify materials)',
                '3-5: 3-5-ETS1-1 (define design problem), 5-PS1-3 (identify materials)',
                '6-8: MS-PS1-3 (synthetic materials impact), MS-ETS1-2 (evaluate designs)',
                '9-12: HS-PS2-6 (material properties), HS-ETS1-3 (optimize solutions)',
                'Cross-curricular: Math (stats, measurement), CS (Arduino, dashboards), Art (design), Business (pricing, marketing)',
                'Full mapping in 06_CURRICULUM_STANDARDS_MAPPING.md',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Resources You Leave With Today',
            'bullets': [
                '✅ Complete Teacher Implementation Guide (50 pages)',
                '✅ 12 Full Lesson Plans with Worksheets (4 grade bands)',
                '✅ Safety SOPs + Risk Assessment + Certification Quizzes',
                '✅ Command Center Google Sheets (8 tabs, auto-formulas)',
                '✅ Launch Deck (30 slides) + Speaker Notes',
                '✅ Grant Templates (4) + Fundraising Scripts (5)',
                '✅ CAD Files (collection box, coaster frame, keychain mold)',
                '✅ Firmware (ESP32 Node 1, Node 2, Radio Tower)',
                '✅ Dashboard (Next.js + Supabase, deploy free)',
                '✅ Ongoing: Monthly office hours, Discord community, sub-ready videos',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Your Next Steps This Week',
            'bullets': [
                '1. Schedule 30-min admin pitch (use Launch Deck Slides 1-24)',
                '2. Complete space assessment (ventilation, power, water, storage)',
                '3. Choose budget tier: Core / FabLab / Center',
                '4. Submit PO or grant application (templates in kit)',
                '5. Recruit 2 Teacher Champions + 4 Student Leads',
                '6. Order equipment (supplier list in 30_SUPPLIER_AND_PARTNER_DIRECTORY.md)',
                '7. Join Discord community for ongoing support',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Support & Community',
            'bullets': [
                '🌐 Website: capcollective.vercel.app',
                '📊 Live Dashboard: bottle-cap-tracker.vercel.app',
                '💬 Discord: discord.gg/capcollective (50+ teachers globally)',
                '📧 Monthly Office Hours: First Tuesday, 4pm ET',
                '🎥 Substitute-Ready Videos: Every machine operation',
                '📚 Instructables: 12-step build guide with photos',
                '❓ Email: support@capcollective.org',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Thank You!',
            'subtitle': 'Questions? Let\'s build the bridge together.',
            'type': 'title'
        },
    ]
    
    for slide_data in slides_data:
        slide = prs.slides.add_slide(blank_layout)
        add_background(slide, COLORS['white'])
        
        if slide_data['type'] == 'title':
            # Title slide
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(7.5), COLORS['dark_green'])
            add_text_box(slide, Inches(1), Inches(2), Inches(11), Inches(1.5),
                        slide_data['title'], font_size=48, bold=True, color=COLORS['white'], alignment=PP_ALIGN.CENTER)
            if 'subtitle' in slide_data:
                add_text_box(slide, Inches(1), Inches(3.5), Inches(11), Inches(1),
                            slide_data['subtitle'], font_size=24, color=COLORS['light_green'], alignment=PP_ALIGN.CENTER)
            add_shape_bg(slide, Inches(5), Inches(5), Inches(3.333), Pt(4), COLORS['accent_orange'])
            
        elif slide_data['type'] == 'bullets':
            # Top bar
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(1.1), COLORS['dark_green'])
            add_text_box(slide, Inches(0.8), Inches(0.2), Inches(11), Inches(0.7),
                        slide_data['title'], font_size=32, bold=True, color=COLORS['white'])
            
            y_pos = Inches(1.4)
            for bullet in slide_data['bullets']:
                add_text_box(slide, Inches(1.2), y_pos, Inches(11), Inches(0.4),
                            '• ' + bullet, font_size=18, color=COLORS['dark_gray'])
                y_pos += Inches(0.42)
            
            # Bottom bar
            add_shape_bg(slide, Inches(0), Inches(7.0), Inches(13.333), Inches(0.5), COLORS['dark_green'])
            add_text_box(slide, Inches(0.5), Inches(7.05), Inches(12), Inches(0.4),
                        "Cap Collective Teacher PD — capcollective.org",
                        font_size=12, color=COLORS['light_green'])
            
        elif slide_data['type'] == 'table':
            # Top bar
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(1.1), COLORS['dark_green'])
            add_text_box(slide, Inches(0.8), Inches(0.2), Inches(11), Inches(0.7),
                        slide_data['title'], font_size=32, bold=True, color=COLORS['white'])
            
            table_data = slide_data['table']
            num_rows = len(table_data)
            num_cols = len(table_data[0])
            table_height = Inches(0.45 * num_rows + 0.1)
            
            add_table(slide, Inches(0.8), Inches(1.4), Inches(11.5), table_height,
                    num_rows, num_cols, table_data, header_color=COLORS['dark_green'], font_size=13)
            
            # Bottom bar
            add_shape_bg(slide, Inches(0), Inches(7.0), Inches(13.333), Inches(0.5), COLORS['dark_green'])
            add_text_box(slide, Inches(0.5), Inches(7.05), Inches(12), Inches(0.4),
                        "Cap Collective Teacher PD — capcollective.org",
                        font_size=12, color=COLORS['light_green'])
    
    prs.save(output_path)
    print(f"Created {output_path} with {len(slides_data)} slides")

def create_launch_week_pptx(output_path):
    """Create Launch Week Run-of-Show PPTX from 19_LAUNCH_WEEK_AND_COMMUNICATIONS_KIT.md"""
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]
    
    slides_data = [
        {
            'title': 'Cap Collective Launch Week',
            'subtitle': 'Run-of-Show & Communications Kit — 5 Days to Live Program',
            'type': 'title'
        },
        {
            'title': 'Launch Week Overview',
            'bullets': [
                'Goal: From zero to live collection + first caps processed in 5 days',
                'Audience: Entire school community (students, staff, parents, partners)',
                'Theme: "Join the Bridge — Create the Impact"',
                'Daily rhythm: Morning announcement → Activity → Reflection → Data entry',
                'Culmination: Friday "First Batch Celebration" with product reveal',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Monday — Kickoff & Box Building',
            'bullets': [
                '🌅 7:30 AM: Green Team sets up boxes in 5 zones (café, gym, entry, library, hallway)',
                '📢 8:00 AM: All-school announcement (script in kit) + Launch Deck mini-assembly (15 min)',
                '🔨 9:00 AM: "Box Building Day" — K-5 decorate, 6-12 assemble laser-cut kits',
                '📦 11:00 AM: Boxes deployed, IR sensors tested, dashboard goes live',
                '📝 1:00 PM: First collection log entries, student role applications open',
                '📱 3:00 PM: Social media launch — #CapCollectiveLaunch #FeedTheBox',
                '📧 4:00 PM: Parent email #1 sent (template in kit)',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Tuesday — Safety Certification & First Collection',
            'bullets': [
                '🌅 7:30 AM: Box check — swap full boxes, log counts',
                '🛡️ 8:30 AM: Safety Certification Stations (rotate every 20 min):',
                '   Station A: Heat Press (temp check, parchment sandwich, timing)',
                '   Station B: Shredder (feed rate, plunger use, sieve test)',
                '   Station C: Wash/Dry (liner removal, soap, 24hr dry)',
                '   Station D: QC (caliper check, batch logging, sign-off)',
                '✅ 11:30 AM: Certified students get role badges + lanyards',
                '🗑️ 1:00 PM: First official Friday-style collection run',
                '📊 2:30 PM: Data Analysts enter counts → dashboard updates live',
                '📧 4:00 PM: Parent email #2 — "Ask your student about their role!"',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Wednesday — Process Cycle Begins',
            'bullets': [
                '🌅 7:30 AM: Collection + weigh-in',
                '🧼 8:00 AM: Wash Station — all caps from Mon/Tue washed, drying racks loaded',
                '⚙️ 10:00 AM: Shredder Demo — certified operators run first batch, sieve to 5-8mm',
                '🔥 11:30 AM: Heat Press Demo — flakes → sheet (140°C HDPE, 5+5+5 min)',
                '❄️ 1:00 PM: Cool under weight, QC check, first sheet photographed',
                '📊 2:00 PM: Data entry — weight, yield %, flake quality notes',
                '🎨 2:30 PM: Design Engineers start Tinkercad coaster designs (K-5: decorate templates)',
                '📧 4:00 PM: Staff update email — "Week 1 progress: X caps, Y kg, Z students certified"',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Thursday — Product Development Sprint',
            'bullets': [
                '🌅 7:30 AM: Collection + weigh-in',
                '✂️ 8:00 AM: Laser Cut Demo — coaster frame cuts 4 coasters from sheet',
                '🎨 9:30 AM: Design Sprint — students iterate coaster designs, vote on top 3',
                '📦 11:00 AM: First coaster batch pressed, cut, sanded, branded',
                '💰 1:00 PM: Business Managers calculate COGS, set pilot price ($8-12/set)',
                '📸 2:00 PM: Product photography for store/website',
                '📊 2:30 PM: Dashboard check — update collection trends, product inventory tab',
                '📱 3:00 PM: Student takeover — Instagram/TikTok "Day in the Life"',
                '📧 4:00 PM: Community partner email — "Come see our launch Friday!"',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Friday — Launch Celebration & First Sale',
            'bullets': [
                '🌅 7:30 AM: Final collection of the week — weigh, log, celebrate totals',
                '🎉 9:00 AM: "First Batch Celebration" Assembly (30 min):',
                '   • Student leads present: caps collected, kg diverted, CO2e saved',
                '   • Reveal first coaster sets — student designers recognized',
                '   • Principal & partners speak',
                '   • Live dashboard on screen — real-time counter',
                '🏪 10:30 AM: POP-UP ECO-STORE OPENS — first sales to students/staff',
                '📊 12:00 PM: Sales data entered → P&L calculated live',
                '📝 1:00 PM: Reflection circles — "What surprised you? What\'s next?"',
                '📱 2:00 PM: Press release sent (template in kit) + social media blitz',
                '📧 4:00 PM: Weekly Impact Report #1 emailed to all stakeholders',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Communications Templates Included',
            'table': [
                ['Template', 'Audience', 'Timing', 'Channel'],
                ['All-School Announcement Script', 'Students/Staff', 'Mon 8:00 AM', 'PA System / Video'],
                ['Parent Email #1: "We\'re Launching!"', 'Parents', 'Mon 4:00 PM', 'Email / Newsletter'],
                ['Parent Email #2: "Ask About Their Role"', 'Parents', 'Tue 4:00 PM', 'Email'],
                ['Staff Weekly Update', 'Teachers/Admin', 'Daily 4:00 PM', 'Email / Slack'],
                ['Community Partner Invitation', 'Local Cafés/Businesses', 'Thu 4:00 PM', 'Email / Print'],
                ['Press Release', 'Local Media', 'Fri 2:00 PM', 'Email / Wire'],
                ['Social Media Pack (7 posts)', 'Community', 'Mon-Fri', 'Instagram/FB/Twitter'],
                ['Student Takeover Guide', 'Students', 'Fri', 'Instagram Stories'],
                ['Impact Report #1', 'All Stakeholders', 'Fri 4:00 PM', 'Email / PDF'],
                ['Grant Progress Update', 'Funders', 'Fri 4:00 PM', 'Email / Portal'],
            ],
            'type': 'table'
        },
        {
            'title': 'Social Media Content Calendar',
            'table': [
                ['Day', 'Post Theme', 'Visual', 'Hashtags', 'Student Lead'],
                ['Monday', 'Launch Announcement', 'Box building photos', '#CapCollectiveLaunch #FeedTheBox', 'Comm Lead'],
                ['Tuesday', 'Safety First', 'Certification badges', '#SafetyFirst #StudentLed', 'Safety Lead'],
                ['Wednesday', 'Process Reveal', 'Shredder/press video', '#CircularEconomy #Upcycle', 'Tech Lead'],
                ['Thursday', 'Design Sprint', 'Coaster designs', '#StudentDesign #STEAM', 'Design Lead'],
                ['Friday', 'CELEBRATION!', 'First products + sales', '#LaunchDay #ZeroWaste', 'All Leads'],
                ['Weekend', 'Impact Summary', 'Dashboard screenshot', '#WeeklyImpact #DataDriven', 'Data Lead'],
                ['Next Mon', 'Week 2 Preview', 'Next week goals', '#Week2 #Momentum', 'Program Lead'],
            ],
            'type': 'table'
        },
        {
            'title': 'Launch Week Success Metrics',
            'bullets': [
                '✅ 5+ collection boxes deployed and logging data',
                '✅ 20+ students safety certified across 4+ stations',
                '✅ 500+ caps collected, weighed, and logged',
                '✅ 1+ full process cycle completed (collect → clean → shred → press → refine)',
                '✅ 1+ product batch finished (coasters/keychains) and QC passed',
                '✅ $100+ in first-day sales at pop-up store',
                '✅ Dashboard live with real data, shared publicly',
                '✅ 3+ parent/community communications sent',
                '✅ 1+ press/social media mention',
                '✅ All stakeholders received Friday Impact Report',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Risk Mitigation — "What If?" Scenarios',
            'table': [
                ['Risk', 'Likelihood', 'Impact', 'Mitigation (in kit)'],
                ['Low collection Day 1', 'Medium', 'Low', 'Backup caps from cafeteria; announce challenge'],
                ['Equipment delay', 'Medium', 'High', 'Core tier uses hand tools; press later'],
                ['Safety incident', 'Low', 'Critical', 'SOPs, certifications, 1:4 ratio, stop-work authority'],
                ['Sensor failure', 'Medium', 'Low', 'Manual entry fallback; CSV import to Sheets'],
                ['Low student sign-up', 'Low', 'Medium', 'Role cards + gamification (24_ENGAGEMENT_GUIDE)'],
                ['Admin pushback', 'Low', 'High', '12_SCHOOL_BUYIN_PLAYBOOK + admin checklist'],
                ['Weather (outdoor boxes)', 'Medium', 'Low', 'Indoor backup zones identified'],
            ],
            'type': 'table'
        },
        {
            'title': 'Thank You — Let\'s Launch!',
            'subtitle': 'Every cap counts. Every student leads. Every week grows.',
            'type': 'title'
        },
    ]
    
    for slide_data in slides_data:
        slide = prs.slides.add_slide(blank_layout)
        add_background(slide, COLORS['white'])
        
        if slide_data['type'] == 'title':
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(7.5), COLORS['dark_green'])
            add_text_box(slide, Inches(1), Inches(2), Inches(11), Inches(1.5),
                        slide_data['title'], font_size=48, bold=True, color=COLORS['white'], alignment=PP_ALIGN.CENTER)
            if 'subtitle' in slide_data:
                add_text_box(slide, Inches(1), Inches(3.5), Inches(11), Inches(1),
                            slide_data['subtitle'], font_size=24, color=COLORS['light_green'], alignment=PP_ALIGN.CENTER)
            add_shape_bg(slide, Inches(5), Inches(5), Inches(3.333), Pt(4), COLORS['accent_orange'])
            
        elif slide_data['type'] == 'bullets':
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(1.1), COLORS['dark_green'])
            add_text_box(slide, Inches(0.8), Inches(0.2), Inches(11), Inches(0.7),
                        slide_data['title'], font_size=32, bold=True, color=COLORS['white'])
            
            y_pos = Inches(1.4)
            for bullet in slide_data['bullets']:
                indent = Inches(1.2)
                if bullet.startswith('   '):
                    indent = Inches(1.6)
                    bullet = bullet.strip()
                add_text_box(slide, indent, y_pos, Inches(11), Inches(0.4),
                            '• ' + bullet, font_size=16, color=COLORS['dark_gray'])
                y_pos += Inches(0.38)
            
            add_shape_bg(slide, Inches(0), Inches(7.0), Inches(13.333), Inches(0.5), COLORS['dark_green'])
            add_text_box(slide, Inches(0.5), Inches(7.05), Inches(12), Inches(0.4),
                        "Cap Collective Launch Week — capcollective.org",
                        font_size=12, color=COLORS['light_green'])
            
        elif slide_data['type'] == 'table':
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(1.1), COLORS['dark_green'])
            add_text_box(slide, Inches(0.8), Inches(0.2), Inches(11), Inches(0.7),
                        slide_data['title'], font_size=32, bold=True, color=COLORS['white'])
            
            table_data = slide_data['table']
            num_rows = len(table_data)
            num_cols = len(table_data[0])
            table_height = Inches(0.4 * num_rows + 0.1)
            
            add_table(slide, Inches(0.5), Inches(1.4), Inches(12.3), table_height,
                    num_rows, num_cols, table_data, header_color=COLORS['dark_green'], font_size=11)
            
            add_shape_bg(slide, Inches(0), Inches(7.0), Inches(13.333), Inches(0.5), COLORS['dark_green'])
            add_text_box(slide, Inches(0.5), Inches(7.05), Inches(12), Inches(0.4),
                        "Cap Collective Launch Week — capcollective.org",
                        font_size=12, color=COLORS['light_green'])
    
    prs.save(output_path)
    print(f"Created {output_path} with {len(slides_data)} slides")

def create_grant_pitch_pptx(output_path):
    """Create Grant Pitch Deck PPTX from 08_GRANT_AND_FUNDRAISING_TEMPLATES.md"""
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]
    
    slides_data = [
        {
            'title': 'Cap Collective',
            'subtitle': 'Student-Led Circular Manufacturing Grant Proposal',
            'type': 'title'
        },
        {
            'title': 'The Problem: Bottle Caps Are a Recycling Blind Spot',
            'bullets': [
                'Only 3% of bottle caps recycled globally (EPA)',
                '60+ billion caps produced annually in US alone',
                'Caps too small for industrial trommels — fall through screens',
                'HDPE #2 / PP #5 caps = high-value material ($500-800/ton) wasted',
                'Top 5 deadliest marine debris — mistaken for food by wildlife',
                'Every school generates 10,000+ caps/semester — all landfilled',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Our Solution: Micro-Factory in Every School',
            'bullets': [
                'Students collect → clean → shred → melt → refine into products',
                '5-step process: Collect, Clean, Shred, Melt (140-170°C), Refine',
                'Closed loop: broken products go back to shredder — 100% recyclable',
                'Three budget tiers: Core ($500), FabLab ($2,500), Center ($10,000+)',
                'Real products: coasters, keychains, organizers, tiles, filament',
                'Revenue funds school garden, grants, scholarships — self-sustaining',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Educational Impact — Standards-Aligned Curriculum',
            'table': [
                ['Grade Band', 'Program Name', 'Focus Areas', 'Key Standards'],
                ['K-2', 'Cap Detectives', 'Observation, sorting, storytelling', 'K-ESS3-3, 2-PS1-1'],
                ['3-5', 'Cap Engineers', 'Measurement, building, basic design', '3-5-ETS1-1, 5-PS1-3'],
                ['6-8', 'Cap Innovators', 'Data, sensors, entrepreneurship', 'MS-PS1-3, MS-ETS1-2'],
                ['9-12', 'Cap Systems Designers', 'LCA, R&D, policy, scale', 'HS-PS2-6, HS-ETS1-3'],
            ],
            'type': 'table'
        },
        {
            'title': 'Measurable Outcomes (Per Semester, Per School)',
            'table': [
                ['Metric', 'Target', 'Measurement Method'],
                ['Caps Collected', '10,000+', 'IR sensor + manual audit'],
                ['Plastic Diverted', '35+ kg', 'Weight logs'],
                ['CO₂e Avoided', '65+ kg', 'EPA WARM model'],
                ['Product Revenue', '$500+', 'POS + inventory tracking'],
                ['Students Engaged', '80% participation', 'Role sign-ups + hours logged'],
                ['Safety Certifications', '100% of machine operators', 'Quiz + practical demo'],
            ],
            'type': 'table'
        },
        {
            'title': 'First-Year Network Goals',
            'bullets': [
                '10+ schools implementing across 3+ districts',
                '100,000+ caps diverted from landfill',
                '500+ students directly engaged in certified roles',
                '$5,000+ product revenue reinvested in school gardens',
                '3+ grant applications submitted (leveraging this funding)',
                'Open-source curriculum adopted by 2+ districts',
                '500+ kit downloads from GitHub',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Budget Breakdown (FabLab Tier — $4,500 per School)',
            'table': [
                ['Category', 'Item', 'Qty', 'Unit Cost', 'Total'],
                ['Processing', 'Secabo TC5 Auto-Open Heat Press', '1', '$950', '$950'],
                ['Processing', 'GDPR Shredder (5-8mm)', '1', '$800', '$800'],
                ['Fabrication', 'Bambu Lab A1 3D Printer', '1', '$299', '$299'],
                ['Fabrication', 'Parametric Molds (Aluminum)', '3', '$150', '$450'],
                ['IoT', 'ESP32-S3 CAM + Ultrasonic (Node 1)', '3', '$45', '$135'],
                ['IoT', 'ESP32 + IR Beam-Break (Node 2)', '5', '$15', '$75'],
                ['IoT', 'ESP32-S3 Radio Tower + Displays', '1', '$120', '$120'],
                ['Safety', 'Ventilation (100 CFM inline fan + duct)', '1', '$300', '$300'],
                ['Safety', 'PPE Bundle (gloves, goggles, respirators, aprons)', '10 sets', '$25', '$250'],
                ['Consumables', 'Parchment, sandpaper, cleaning, molds', '—', '—', '$300'],
                ['Curriculum', 'Printed guides, worksheets, badges', '—', '—', '$200'],
                ['Contingency', '10% buffer', '—', '—', '$421'],
                ['TOTAL', '', '', '', '$4,300'],
            ],
            'type': 'table'
        },
        {
            'title': 'Sustainability Model — Self-Funding After Year 1',
            'bullets': [
                'Year 1: Grant covers equipment + startup consumables',
                'Year 2+: Product revenue ($500-2,000/semester) covers consumables',
                'Eco-store profit split: 50% school garden, 30% program growth, 20% scholarships',
                'Grant writing embedded in 9-12 curriculum — students write next year\'s grants',
                'District scale: Hub school supports 4-5 spoke schools (shared equipment)',
                'Corporate sponsorship: Local cafés buy coasters → closed loop in community',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Evaluation Plan — Data-Driven Impact Reporting',
            'bullets': [
                'Real-time dashboard: caps collected, weight, products, revenue, participation',
                'Monthly: Collection trends, product mix, student hours, safety incidents',
                'Semester: Full impact report (environmental, educational, economic)',
                'Annual: Third-party audit + student portfolio showcase',
                'Data shared openly: GitHub repo, public dashboards, research partnerships',
                'IRB-ready protocol for academic research on STEM engagement + environmental behavior',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Equity & Access — Every School Can Start',
            'bullets': [
                'Core Tier ($500): Manual shredder, budget press, DIY boxes — works in any classroom',
                'No internet required: Paper logs → Google Sheets when available',
                'Multilingual resources: Spanish, French, Mandarin translations in progress',
                'Accessibility guide: Physical, sensory, language, economic adaptations (25_ACCESSIBILITY_GUIDE.md)',
                'Rural/underserved priority: Grant templates target Title I, REAP, USDA Rural',
                'Indigenous knowledge integration: Local material traditions + circular principles',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Team & Partners',
            'bullets': [
                'Lead: [Your Name], [Title], [School/Org] — [brief bio]',
                'Teacher Champions: 2-3 per school (PD certified)',
                'Student Leads: 7 rotating roles per semester',
                'Technical Advisor: [Local maker/engineer/university partner]',
                'Community Partners: [Local cafés, recycling orgs, businesses]',
                'Fiscal Sponsor: [School district / 501(c)(3) / PTA]',
                'Open Source Community: 50+ educators on Discord, 500+ GitHub stars',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Grant Request & Use of Funds',
            'table': [
                ['Funding Source', 'Amount', 'Use', 'Timeline'],
                ['[Foundation Name]', '$25,000', '5 schools × FabLab tier equipment', 'Months 1-3'],
                ['[Corporate Sponsor]', '$10,000', 'IoT sensor network + dashboard hosting', 'Months 1-2'],
                ['[Government Grant]', '$50,000', 'District hub (Center tier) + 4 spoke schools', 'Months 1-6'],
                ['PTA / Local', '$5,000', 'Consumables + safety gear + launch events', 'Months 1-2'],
                ['In-Kind', '$15,000', 'Venue, mentorship, materials, volunteer hours', 'Ongoing'],
                ['TOTAL REQUEST', '$105,000', 'Full district launch + open source maintenance', 'Year 1'],
            ],
            'type': 'table'
        },
        {
            'title': 'Why Fund Cap Collective?',
            'bullets': [
                '✅ Proven model: Pilot schools hit 10K caps in 8 weeks',
                '✅ Student-led: Builds agency, not teacher workload',
                '✅ Standards-aligned: Not an "add-on" — replaces/enhances existing units',
                '✅ Revenue-generating: Unique among sustainability programs',
                '✅ Scalable: Hub-and-spoke model for district/state adoption',
                '✅ Open source: Your investment benefits schools globally, forever',
                '✅ Measurable: Live data, third-party auditable, research-ready',
                '✅ Community-centered: Closes loop with local businesses',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Next Steps',
            'bullets': [
                '1. Site visit / virtual demo: Schedule at capcollective.org/demo',
                '2. Pilot agreement: 1 semester, 1 school, full kit + support',
                '3. Funding commitment: [Specific ask based on funder]',
                '4. Launch date: Target [Month] 2024',
                '5. Impact reporting: Monthly dashboards + semester report + annual audit',
            ],
            'type': 'bullets'
        },
        {
            'title': 'Thank You',
            'subtitle': '"Don\'t just watch the bridge being built. Cross it with us."',
            'contact': 'capcollective.org | support@capcollective.org | @CapCollective',
            'type': 'title'
        },
    ]
    
    for slide_data in slides_data:
        slide = prs.slides.add_slide(blank_layout)
        add_background(slide, COLORS['white'])
        
        if slide_data['type'] == 'title':
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(7.5), COLORS['dark_green'])
            add_text_box(slide, Inches(1), Inches(2), Inches(11), Inches(1.5),
                        slide_data['title'], font_size=48, bold=True, color=COLORS['white'], alignment=PP_ALIGN.CENTER)
            if 'subtitle' in slide_data:
                add_text_box(slide, Inches(1), Inches(3.5), Inches(11), Inches(1),
                            slide_data['subtitle'], font_size=24, color=COLORS['light_green'], alignment=PP_ALIGN.CENTER)
            if 'contact' in slide_data:
                add_text_box(slide, Inches(1), Inches(5), Inches(11), Inches(0.5),
                            slide_data['contact'], font_size=18, color=COLORS['light_green'], alignment=PP_ALIGN.CENTER)
            add_shape_bg(slide, Inches(5), Inches(4.5), Inches(3.333), Pt(4), COLORS['accent_orange'])
            
        elif slide_data['type'] == 'bullets':
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(1.1), COLORS['dark_green'])
            add_text_box(slide, Inches(0.8), Inches(0.2), Inches(11), Inches(0.7),
                        slide_data['title'], font_size=32, bold=True, color=COLORS['white'])
            
            y_pos = Inches(1.4)
            for bullet in slide_data['bullets']:
                indent = Inches(1.2)
                if bullet.startswith('   '):
                    indent = Inches(1.6)
                    bullet = bullet.strip()
                add_text_box(slide, indent, y_pos, Inches(11), Inches(0.4),
                            '• ' + bullet, font_size=17, color=COLORS['dark_gray'])
                y_pos += Inches(0.4)
            
            add_shape_bg(slide, Inches(0), Inches(7.0), Inches(13.333), Inches(0.5), COLORS['dark_green'])
            add_text_box(slide, Inches(0.5), Inches(7.05), Inches(12), Inches(0.4),
                        "Cap Collective Grant Pitch — capcollective.org",
                        font_size=12, color=COLORS['light_green'])
            
        elif slide_data['type'] == 'table':
            add_shape_bg(slide, Inches(0), Inches(0), Inches(13.333), Inches(1.1), COLORS['dark_green'])
            add_text_box(slide, Inches(0.8), Inches(0.2), Inches(11), Inches(0.7),
                        slide_data['title'], font_size=32, bold=True, color=COLORS['white'])
            
            table_data = slide_data['table']
            num_rows = len(table_data)
            num_cols = len(table_data[0])
            table_height = Inches(0.4 * num_rows + 0.1)
            
            add_table(slide, Inches(0.4), Inches(1.4), Inches(12.5), table_height,
                    num_rows, num_cols, table_data, header_color=COLORS['dark_green'], font_size=11)
            
            add_shape_bg(slide, Inches(0), Inches(7.0), Inches(13.333), Inches(0.5), COLORS['dark_green'])
            add_text_box(slide, Inches(0.5), Inches(7.05), Inches(12), Inches(0.4),
                        "Cap Collective Grant Pitch — capcollective.org",
                        font_size=12, color=COLORS['light_green'])
    
    prs.save(output_path)
    print(f"Created {output_path} with {len(slides_data)} slides")

def main():
    base_path = r"C:\Users\david\Desktop\Cap Collective"
    
    # 1. Launch Deck from markdown
    print("Generating Launch Deck PPTX...")
    with open(os.path.join(base_path, "01_LAUNCH_DECK_PRESENTATION.md"), 'r', encoding='utf-8') as f:
        launch_deck_md = f.read()
    slides = parse_launch_deck(launch_deck_md)
    create_launch_deck_pptx(slides, os.path.join(base_path, "Cap_Collective_Launch_Deck.pptx"))
    
    # 2. Teacher PD Workshop
    print("Generating Teacher PD Workshop PPTX...")
    create_teacher_pd_pptx(os.path.join(base_path, "Cap_Collective_Teacher_PD_Workshop.pptx"))
    
    # 3. Launch Week Run-of-Show
    print("Generating Launch Week Run-of-Show PPTX...")
    create_launch_week_pptx(os.path.join(base_path, "Cap_Collective_Launch_Week_Run_of_Show.pptx"))
    
    # 4. Grant Pitch Deck
    print("Generating Grant Pitch Deck PPTX...")
    create_grant_pitch_pptx(os.path.join(base_path, "Cap_Collective_Grant_Pitch_Deck.pptx"))
    
    print("\n[SUCCESS] All 4 PPTX files created successfully!")

if __name__ == "__main__":
    main()