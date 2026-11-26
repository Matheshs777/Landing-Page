# Asset credits

Both vehicles are third-party glTF models served locally. They render with their
original materials, textures and colours; nothing is overridden at runtime.

Models installed: **26 November 2026**.

---

## 1. NOVARIS VX-01 study

- **File:** `public/models/car/supercar.glb`
- **Title (from metadata):** 2024 Porsche 992 GT3 R
- **Creator:** Dave Love (`Tyler_Dave`) — https://sketchfab.com/Tyler_Dave
- **Source:** https://sketchfab.com/3d-models/2024-porsche-992-gt3-r-b76c9b2ae2d548c3869426eac4ab8a19
- **Licence:** CC BY 4.0 — http://creativecommons.org/licenses/by/4.0/
- **Original size:** 39,967,176 bytes (served: 3,432,780 bytes)
- **Content:** Race-prepared GT car with its original motorsport livery, sponsor
  decals and manufacturer badges intact.
- **Normalisation:** Authored at roughly 1:96 scale. The viewer scales the whole
  scene uniformly to the 4,601 mm length declared in `src/config/vehicles.js`.
  No mesh or material is edited.

## 2. NOVARIS R-01 study

- **File:** `public/models/bike/superbike.glb`
- **Title (from metadata):** Sports Bike
- **Creator:** Futurealiti — https://sketchfab.com/futurealiti
- **Source:** https://sketchfab.com/3d-models/sports-bike-a80259b859c842d5824c25c61e0fc421
- **Licence:** CC BY 4.0 — http://creativecommons.org/licenses/by/4.0/
- **Original size:** 41,409,232 bytes (served: 3,101,208 bytes)
- **Content:** Fully faired production-derived superbike with its original paint
  and decals.
- **Normalisation:** Authored in metres. Uniformly scaled to the 2,075 mm length
  declared in config. No mesh or material is edited.

---

## Processing

Both files were compressed for delivery with `@gltf-transform/cli` 4.5.1:

```
gltf-transform optimize <input> <output> \
  --compress draco \
  --texture-compress webp \
  --texture-size 4096 \
  --simplify false \
  --palette false \
  --prune-solid-textures false
```

- Geometry: Draco compression, decoded locally from `public/draco/`.
- Textures: re-encoded to WebP, capped at 4096 px. No material factors, colours
  or texture assignments were changed.
- Simplification disabled and palette merging disabled, so silhouettes and
  individual materials survive exactly.
- Final served sizes: car 3.27 MB; bike 2.96 MB.

## What the site does at runtime

- Loads one GLB per vehicle through `useGLTF`, cached and cloned per viewer.
- Centres each model on X/Z, drops its lowest point to the studio floor and
  scales it uniformly to its declared real-world length.
- Raises `envMapIntensity` so the studio environment reads correctly. Colour,
  maps and surface values are untouched.
- No paint picker, no material overrides, no CSS filters on the canvas.

## Trademarks and livery — action required before launch

The CC BY 4.0 licence covers the model author's copyright only. It does not
grant rights to the real-world trademarks visible in the livery.

- The VX-01 model carries **Porsche**, **Manthey**, **DHL**, **Goodyear**,
  **Pirelli** and **E-TECH** marks, plus the racing number 91.
- The R-01 model carries manufacturer and sponsor marks of its own.

NOVARIS is fictional and is not associated with any of these companies. Using
the models as-is is fine for a private, non-commercial design study with
attribution. Before a public or commercial launch, choose one:

1. **Clear the marks** with the rights holders.
2. **Replace the livery texture** with a neutral one, keeping the model's body
   colour and geometry (a texture-only change, no material override).
3. **Remove the logo decals**, keeping the base paint, subject to the licence.

Per the brief, this pass presents the models unmodified and documents the issue
rather than silently editing them.

## Imagery

Every vehicle view on the site is rendered live in the browser from these two
files. No third-party vehicle photography is used. `public/images/og.jpg` is a
placeholder social image from the same studio.

## Typography and software

- **Bodoni Moda** — SIL Open Font License 1.1, self-hosted.
- **Inter Tight** — SIL Open Font License 1.1, self-hosted.
- **three.js**, **React Three Fiber**, **drei** — MIT.
- **GSAP**, **Framer Motion**, **Lenis** — their respective licences.

## Disclaimer

NOVARIS is a fictional marque created for this design study. Vehicle names,
specifications, performance figures and availability are illustrative concept
targets and do not represent a production programme or any real manufacturer.
