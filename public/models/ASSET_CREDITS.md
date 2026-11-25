# Asset credits

All vehicle geometry in this project is genuine glTF content supplied for this
build. No vehicle is represented by primitives, and no asset is hotlinked:
every file is served locally from `public/models/`.

Models installed: **24 November 2026**.

---

## 1. NOVARIS VX-01 automobile

- **File:** `public/models/car/supercar.glb`
- **Supplied as:** `supercar.glb` (project owner upload)
- **Creator / publisher:** Not stated in the file metadata
- **Licence:** Not stated in the file metadata. Confirm redistribution rights
  with the project owner before publishing the model publicly.
- **Original size:** 39,967,176 bytes
- **Source generator metadata:** `Sketchfab-0.6.0`
- **Notes:** Race-derived GT study. The source model carries a real-world
  motorsport livery and manufacturer badge textures; these are replaced at
  runtime with the fictional NOVARIS identity. Dimensions after normalisation:
  4,601 × 1,981 × 1,211 mm (length × width × height), 2,457 mm wheelbase.

## 2. NOVARIS R-01 superbike

- **File:** `public/models/bike/superbike.glb`
- **Supplied as:** `superbike.glb` (project owner upload)
- **Creator / publisher:** Not stated in the file metadata
- **Licence:** Not stated in the file metadata. Confirm redistribution rights
  with the project owner before publishing the model publicly.
- **Original size:** 41,409,232 bytes
- **Source generator metadata:** `Sketchfab-15.25.0`
- **Notes:** Fully faired race-replica superbike. Manufacturer decal textures
  are removed at runtime and replaced with the fictional NOVARIS identity.
  Dimensions after normalisation: 2,075 × 810 × 1,110 mm, 1,436 mm wheelbase.

---

## Processing

Both supplied files were optimised locally with `@gltf-transform/cli` 4.5.1.

The automobile was authored at 1:96.5 scale and was first normalised to metres
(`scripts/scale-model.mjs`) so the welder and simplifier used sane tolerances.

```
gltf-transform optimize <input> <output> \
  --compress meshopt --texture-compress webp --texture-size 2048 \
  --simplify true --simplify-ratio 0.45 --simplify-error 0.001 \
  --palette false
```

- Geometry compression: `EXT_meshopt_compression` + `KHR_mesh_quantization`
  (decoded at runtime by drei's `useGLTF`).
- Textures re-encoded to WebP, capped at 2048 px.
- Palette merging disabled so individual paint, glass, rubber and metal
  materials keep their names and can be addressed by the configurator.
- Final served sizes: car 3,277,896 bytes; bike 3,135,464 bytes.
- The original uploads are not redistributed; only the optimised versions are
  served from `public/models/`.

## Branding and livery

The supplied models contain real-world manufacturer badges, decals and tyre
lettering. For this fictional marque build, the following are overridden at
runtime (see `src/scenes/model.js`):

- body paint textures are replaced with the selected NOVARIS paint;
- badge, banner and decal atlases are replaced with solid trim colours;
- tyre sidewall textures are replaced with a plain rubber colour.

No manufacturer logo is rendered in the live 3D scenes or in the site imagery.
The underlying geometry is still a representation of a real-world road/race
vehicle and is used here as a design-study stand-in at the project owner's
direction.

## Imagery

All vehicle photography on this site is rendered in-house from the two models
above, using the same studio lighting rig as the live 3D scenes. The renders
are released as part of this design study. No third-party photography is used.

## Typography

- **Bodoni Moda** — SIL Open Font License 1.1, served via Google Fonts.
- **Inter Tight** — SIL Open Font License 1.1, served via Google Fonts.

## Disclaimer

NOVARIS is a fictional marque created for this design study. Vehicle names,
specifications, performance figures and availability are illustrative concept
targets and do not represent a production programme or any real manufacturer.
