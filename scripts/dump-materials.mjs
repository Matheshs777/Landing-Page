import fs from 'node:fs'
import path from 'node:path'
import { NodeIO } from '@gltf-transform/core'

const input = process.argv[2]
const tag = process.argv[3] ?? 'model'
const outDir = path.resolve('qa-shots/mats', tag)
fs.mkdirSync(outDir, { recursive: true })

const io = new NodeIO()
const doc = await io.read(input)
const root = doc.getRoot()

const lines = []
for (const mesh of root.listMeshes()) {
  for (const prim of mesh.listPrimitives()) {
    const mat = prim.getMaterial()
    const tex = mat?.getBaseColorTexture()
    lines.push(
      `${mesh.getName()} | ${mat?.getName() ?? 'none'} | ${tex ? tex.getMimeType() + ' ' + tex.getSize().join('x') : ''}`,
    )
    if (tex) {
      const file = path.join(outDir, `${mat.getName().replace(/[^\w.-]+/g, '_')}.png`)
      if (!fs.existsSync(file)) fs.writeFileSync(file, tex.getImage())
    }
  }
}
fs.writeFileSync(path.join(outDir, 'meshes.txt'), lines.join('\n'))
console.log(lines.join('\n'))
