// ============================================================
// Cap Collective — Collection Box (Laser-cut flat panels)
// ------------------------------------------------------------
// Export: Top view (numpad 7) -> File -> Export -> Export as DXF
// Assembly: wood glue + 4mm screws (matches Teacher Guide 3.3)
// Units: millimeters
// ============================================================

SHOW_LABELS = false;   // set true to show panel names (reference only)

// ---- Main dimensions (EDIT THESE) ----
t      = 5;      // plywood thickness
W_OUT  = 240;    // outer width
D_OUT  = 200;    // outer depth
H_OUT  = 350;    // outer height

// derived inner sizes
W_IN = W_OUT - 2*t;
D_IN = D_OUT - 2*t;
H_IN = H_OUT - 2*t;

// ---- Layout ----
gap     = 30;    // spacing between panels
screw_d = 4;     // screw pilot diameter
inset   = 12;    // screw inset from edges

// ---- Front features ----
slot_w  = 110;   // cap drop slot width
slot_h  = 35;    // cap drop slot height
slot_y  = 60;    // slot bottom Y
win_w   = 150;   // acrylic window width
win_h   = 150;   // acrylic window height
win_y   = 150;   // window bottom Y

// ---- Helpers ----
module corner_holes(w, h) {
    for (x = [inset, w - inset])
        for (y = [inset, h - inset])
            translate([x, y]) circle(d = screw_d);
}

module panel(w, h) {
    difference() {
        square([w, h]);
        corner_holes(w, h);
    }
}

module front_panel() {
    difference() {
        panel(W_IN, H_IN);
        translate([W_IN/2 - slot_w/2, slot_y]) square([slot_w, slot_h]);
        translate([W_IN/2 - win_w/2,  win_y])  square([win_w,  win_h]);
    }
}

module back_panel() {
    difference() {
        panel(W_IN, H_IN);
        // IR sensor mounting holes + beam slot (align with drop slot)
        translate([W_IN/2 - 20, slot_y + slot_h/2]) circle(d = 3);
        translate([W_IN/2 + 20, slot_y + slot_h/2]) circle(d = 3);
        translate([W_IN/2 - 6,  slot_y + slot_h/2 - 3]) square([12, 6]);
    }
}

module label(txt, w) {
    if (SHOW_LABELS)
        translate([w/2, -8]) text(txt, size = 8, halign = "center");
}

// ---- Layout ----
x0 = 0;
x1 = W_IN + gap;
x2 = 2*(W_IN + gap);
x3 = 3*(W_IN + gap);
x4 = 4*(W_IN + gap);
x5 = 5*(W_IN + gap);

// Bottom
translate([x0, 0]) { panel(W_IN, D_IN);  label("BOTTOM", W_IN); }
// Front
translate([x1, 0]) { front_panel();      label("FRONT", W_IN); }
// Back
translate([x2, 0]) { back_panel();       label("BACK", W_IN); }
// Left
translate([x3, 0]) { panel(D_IN, H_IN);  label("LEFT", D_IN); }
// Right
translate([x4, 0]) { panel(D_IN, H_IN);  label("RIGHT", D_IN); }
// Lid (optional)
translate([x5, 0]) { panel(W_IN, D_IN);  label("LID", W_IN); }

// Cut notes (reference only, not exported if SHOW_LABELS false)
if (SHOW_LABELS) {
    translate([0, -30]) text("Cap Collective — Collection Box — glue + screw assembly", size = 10);
}
