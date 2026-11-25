# Asset credits

Both vehicles are genuine glTF models supplied for this build. They are served
unmodified: the exact files uploaded by the project owner are the files the site
loads. No livery, decal, texture, material or piece of geometry is replaced or
removed at runtime, and no asset is hotlinked.

Models installed: **25 November 2026**.

---

## 1. NOVARIS VX-01 automobile

- **File:** `public/models/car/supercar.glb`
- **Supplied as:** `supercar.glb` (project owner upload)
- **Size:** 39,967,176 bytes
- **Creator / publisher:** Not stated in the file metadata
- **Licence:** Not stated in the file metadata. Confirm redistribution rights
  with the project owner before publishing the model publicly.
- **Source generator metadata:** `Sketchfab-0.6.0`
- **Content:** A race-prepared GT car with its original motorsport livery,
  sponsor decals and manufacturer badges intact.
- **Normalisation:** The file is authored at roughly 1:96 scale. The viewer
  scales the whole scene uniformly to the 4,601 mm length declared in
  `src/config/vehicles.js` so camera framing is in metres. This is an overall
  transform only; no mesh or material is edited.

## 2. NOVARIS R-01 superbike

- **File:** `public/models/bike/superbike.glb`
- **Supplied as:** `superbike.glb` (project owner upload)
- **Size:** 41,409,232 bytes
- **Creator / publisher:** Not stated in the file metadata
- **Licence:** Not stated in the file metadata. Confirm redistribution rights
  with the project owner before publishing the model publicly.
- **Source generator metadata:** `Sketchfab-15.25.0`
- **Content:** A fully faired production-derived superbike with its original
  paint, decals and manufacturer marks intact.
- **Normalisation:** The file is already authored in metres. The viewer scales
  it uniformly to the 2,075 mm length declared in `src/config/vehicles.js`.
  No mesh or material is edited.

---

## What the site does with the files

- **Nothing is rewritten.** Both GLBs are copied byte-for-byte into
  `public/models/`.
- **Runtime normalisation only.** Each model is centred on X/Z, dropped so its
  lowest point rests on the studio floor, and uniformly scaled to its declared
  real-world length.
- **Lighting integration.** `envMapIntensity` is raised so the studio
  environment reads correctly. Colour, maps and surface values are untouched.
- **Paint studies are opt-in.** The configurators open on **Original finish**,
  which renders the file's own materials. Choosing a NOVARIS paint temporarily
  recolours the body-paint material named in `src/config/vehicles.js`; choosing
  Original restores the file's own map, colour and roughness values from a
  per-clone snapshot.

Because the models retain their real-world livery and badges, they are used
here as supplied visual stand-ins for a fictional marque. They are not
NOVARIS-designed vehicles and this project claims no association with the
original manufacturers or sponsors.

## Imagery

Every vehicle image on the site is rendered in-house from these two files with
the same studio rig used by the live 3D scenes (`scripts/render-assets.mjs`).
No third-party photography is used.

## Typography

- **Bodoni Moda** — SIL Open Font License 1.1, served via Google Fonts.
- **Inter Tight** — SIL Open Font License 1.1, served via Google Fonts.

## Disclaimer

NOVARIS is a fictional marque created for this design study. Vehicle names,
specifications, performance figures and availability are illustrative concept
targets and do not represent a production programme or any real manufacturer.
