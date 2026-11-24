# Asset credits

All vehicle geometry in this project is genuine, downloadable glTF content. No
vehicle is represented by primitives, and no asset is hotlinked: every file is
served locally from `public/models/`.

Downloaded: **24 November 2026**.

---

## 1. Generic mid-engine supercar

- **File:** `public/models/car/supercar.glb`
- **Asset name:** Generic mid-engine supercar
- **Creator / publisher:** Innerscene (3D Parts Library)
- **Source page:** https://www.innerscene.com/tools/library/3d-parts/generic-mid-engine-supercar-73f252c5
- **Download endpoint:** https://www.innerscene.com/api/library/generic-mid-engine-supercar-73f252c5/download
- **License:** CC0 1.0 Universal (public domain dedication)
- **License reference:** https://creativecommons.org/publicdomain/zero/1.0/
- **Attribution:** Not required by the licence. Credited here as a courtesy.
- **Original size:** 3,949,472 bytes
- **Notes:** Unbranded design study. 4,631 × 2,090 × 1,189 mm, 2,700 mm
  wheelbase. Used as the NOVARIS VX-01 concept automobile.

## 2. Race-replica superbike, fully faired

- **File:** `public/models/bike/superbike.glb`
- **Asset name:** Race-replica superbike, fully faired
- **Creator / publisher:** Innerscene (3D Parts Library)
- **Source page:** https://www.innerscene.com/tools/library/3d-parts/race-replica-superbike-fully-faired-badbd83b
- **Download endpoint:** https://www.innerscene.com/api/library/race-replica-superbike-fully-faired-badbd83b/download
- **License:** CC0 1.0 Universal (public domain dedication)
- **License reference:** https://creativecommons.org/publicdomain/zero/1.0/
- **Attribution:** Not required by the licence. Credited here as a courtesy.
- **Original size:** 21,033,196 bytes
- **Notes:** Unbranded race-replica study, 874 × 2,036 × 1,030 mm. Used as the
  NOVARIS R-01 concept superbike.

---

## Processing

Both models were optimised locally with `@gltf-transform/cli` 4.5.1:

```
gltf-transform optimize <input> <output> \
  --compress meshopt --texture-compress webp --texture-size 1024 \
  --simplify false --palette false
```

- Geometry compression: `EXT_meshopt_compression` + `KHR_mesh_quantization`
  (decoded at runtime by drei's `useGLTF`).
- Textures re-encoded to WebP, capped at 1024 px.
- No mesh simplification and no palette reduction, so silhouette and material
  separation are preserved.
- Original files are not redistributed; only the optimised versions are served.
- Final sizes: car 1,049,100 bytes; bike 1,608,104 bytes.

## Imagery

All vehicle photography on this site is rendered in-house from the two CC0
models above, using the same studio lighting rig as the live 3D scenes. The
renders are released as part of this design study. No third-party photography
is used, and no manufacturer trademarks are present in the 3D assets.

## Typography

- **Bodoni Moda** — SIL Open Font License 1.1, served via Google Fonts.
- **Inter Tight** — SIL Open Font License 1.1, served via Google Fonts.

## Disclaimer

NOVARIS is a fictional marque created for this design study. Vehicle names,
specifications, performance figures and availability are illustrative concept
targets and do not represent a production programme or any real manufacturer.
