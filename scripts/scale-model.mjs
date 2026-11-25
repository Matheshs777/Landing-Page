import { NodeIO } from '@gltf-transform/core'

/**
 * Normalises a supplied GLB to real-world metres before optimisation, so the
 * welder and simplifier use sane absolute tolerances.
 *
 * usage: node scripts/scale-model.mjs <in> <out> <scale>
 */
const [input, output, rawScale] = process.argv.slice(2)
if (!input || !output || !rawScale) {
  console.error('usage: node scripts/scale-model.mjs <in> <out> <scale>')
  process.exit(1)
}

const scale = Number(rawScale)
const io = new NodeIO()
const doc = await io.read(input)
const root = doc.getRoot()
const scene = root.listScenes()[0]

for (const node of scene.listChildren()) {
  const current = node.getScale()
  node.setScale([current[0] * scale, current[1] * scale, current[2] * scale])
}

await io.write(output, doc)
console.log('scaled', input, 'x' + scale, '->', output)
