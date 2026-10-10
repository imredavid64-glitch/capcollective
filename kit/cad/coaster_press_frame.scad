// ============================================================
// Cap Collective — Coaster Heat-Press Frame (laser-cut)
// ------------------------------------------------------------
// A 2x2 frame that molds 4 round coasters per press cycle.
// Export: Top view (numpad 7) -> File -> Export -> Export as DXF
// Units: millimeters
// ============================================================

SHOW_LABELS = false;

// ---- Parameters (EDIT THESE) ----
coaster_d = 90;    // coaster diameter
frame     = 200;   // outer frame size (square)
wall      = 12;    // frame border width
handle_w  = 25;    // side handle width (for lift-out)

// ---- Derived ----
module coaster_hole(cx, cy) {
    translate([cx, cy]) circle(d = coaster_d);
}

module screws(cx, cy, size) {
    // clamp screw holes in the four corners of the frame
    for (x = [cx - size/2 + 6, cx + size/2 - 6])
        for (y = [cy - size/2 + 6, cy + size/2 - 6])
            translate([x, y]) circle(d = 4);
}

// 2x2 grid centers
c1 = frame/4;
c2 = 3*frame/4;

difference() {
    union() {
        // main frame
        square([frame, frame]);
        // side handles (optional lift tabs)
        translate([-handle_w, frame/2 - 20]) square([handle_w, 40]);
        translate([frame, frame/2 - 20])    square([handle_w, 40]);
    }
    // coaster cavities
    coaster_hole(c1, c1);
    coaster_hole(c2, c1);
    coaster_hole(c1, c2);
    coaster_hole(c2, c2);
    // clamp screw holes
    screws(frame/2, frame/2, frame);
}

// ---- Reference: single coaster outline (cut separately) ----
if (SHOW_LABELS) {
    translate([frame + handle_w + 30, 0]) circle(d = coaster_d);
    translate([0, -20]) text("Cap Collective — Coaster Press Frame", size = 9);
    translate([0, -32]) text("Cavity for HDPE sheet; press 140C x5min + flip x5min", size = 7);
}
