# Cap Collective — CAD Folder

This folder holds all fabrication files (laser, CNC, 3D print).

## Contents
| File | Type | Machine | Purpose |
|------|------|---------|---------|
| `collection_box.scad` | OpenSCAD | Laser (DXF) | Flat panels for the collection box |
| `coaster_press_frame.scad` | OpenSCAD | Laser (DXF) | Heat-press frame to mold 4 coasters |
| `keychain_mold.scad` | OpenSCAD | 3D printer (STL) | Two-part injection mold for a keychain |
| `[your files]` | .f3d / .step / .dxf / .stl | — | Final production files (to be added) |

## How to export
**OpenSCAD (.scad):**
1. Install OpenSCAD (free — openscad.org).
2. Open the file and edit the parameters at the top.
3. **2D laser file:** View → Top (numpad 7) → File → Export → Export as DXF.
4. **3D print file:** Render (F6) → File → Export → Export as STL.

## Naming convention
```
part_variant_version.ext
box_front_v1.dxf
mold_keychain_v1.stl
coaster_jig_v1.dxf
```

## Notes
- The `.scad` files are **parametric starters** — adjust all dimensions to your material and needs.
- Set `SHOW_LABELS = false` before exporting a DXF for cutting (labels are reference only).
- All dimensions are in **millimeters**.
- When adding your own CAD files, update `../14_ASSET_CAD_AND_TOOLS_INDEX.md` Section 2.1.
