// ============================================================
// Cap Collective — Keychain Injection Mold (3D print / CNC)
// ------------------------------------------------------------
// Two-part mold for a round keychain (single polymer / mono-material).
// Render (F6) -> File -> Export -> Export as STL
// Units: millimeters
// ============================================================

$fn = 64;

// ---- Parameters (EDIT THESE) ----
blk_x    = 90;
blk_y    = 60;
blk_z    = 18;    // block thickness (each half)

cav_d    = 40;    // keychain cavity diameter
cav_deep = 5;     // cavity depth per half  (total product ~10mm)
hole_d   = 4;     // keyring loop hole in the product
hole_off = cav_d/2 + 8;   // distance of loop hole from cavity center

pin_d    = 6;     // alignment pin diameter
pin_h    = 8;     // alignment pin height
pin_inset = 8;    // pin inset from block corner

sprue_d  = 5;     // injection gate diameter

// ---- One mold half ----
module half(with_pins) {
    difference() {
        cube([blk_x, blk_y, blk_z], center = true);

        // keychain cavity
        translate([0, 0, blk_z/2 - cav_deep/2])
            cylinder(h = cav_deep + 0.02, d = cav_d, center = true);

        // keyring loop hole
        translate([hole_off, 0, blk_z/2 - cav_deep/2])
            cylinder(h = cav_deep + 0.02, d = hole_d, center = true);

        // sprue / gate (from top edge into cavity)
        translate([0, blk_y/2 - 4, blk_z/2 - 2]) rotate([90, 0, 0])
            cylinder(h = 12, d = sprue_d, center = true);

        // vent slit (opposite side)
        translate([0, -blk_y/2 + 4, blk_z/2]) rotate([90, 0, 0])
            cube([1.5, 12, 1.2], center = true);

        // alignment pin HOLES (in the half without pins)
        if (!with_pins)
            for (x = [-blk_x/2 + pin_inset, blk_x/2 - pin_inset])
                for (y = [-blk_y/2 + pin_inset, blk_y/2 - pin_inset])
                    translate([x, y, 0])
                        cylinder(h = blk_z + 2, d = pin_d, center = true);
    }

    // alignment PINS (on the other half)
    if (with_pins)
        for (x = [-blk_x/2 + pin_inset, blk_x/2 - pin_inset])
            for (y = [-blk_y/2 + pin_inset, blk_y/2 - pin_inset])
                translate([x, y, blk_z/2])
                    cylinder(h = pin_h, d = pin_d);
}

// ---- Lay out both halves side by side for printing ----
translate([-blk_x/2 - 5, 0, blk_z/2]) half(true);    // top half (with pins)
translate([ blk_x/2 + 5, 0, blk_z/2]) half(false);   // bottom half (with holes)

// ---- Notes ----
// Print material: PETG or ASA (withstands injection temps better than PLA).
// Apply release agent to cavity before use.
// Mono-material: use HDPE or PP flakes only, so the product can be re-shredded.
