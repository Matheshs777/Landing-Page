import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const dir = 'qa-shots/renders'
const files = fs.readdirSync(dir).filter((file) => file.endsWith('.png')).sort()
const cols = 4
const tw = 400
const th = 250
const labelH = 20
const rows = Math.ceil(files.length / cols)
const comps = []

for (let i = 0; i < files.length; i += 1) {
  const file = files[i]
  const buf = await sharp(path.join(dir, file))
    .resize(tw, th, { fit: 'cover' })
    .toBuffer()
  const label = Buffer.from(
    `<svg width="${tw}" height="${labelH}"><rect width="100%" height="100%" fill="#111"/><text x="8" y="14" font-family="monospace" font-size="11" fill="#fff">${file.replace('.png', '')}</text></svg>`,
  )
  const left = (i % cols) * tw
  const top = Math.floor(i / cols) * (th + labelH)
  comps.push({ input: buf, left, top })
  comps.push({ input: label, left, top: top + th })
}

await sharp({
  create: { width: cols * tw, height: rows * (th + labelH), channels: 3, background: '#222' },
})
  .composite(comps)
  .jpeg({ quality: 84 })
  .toFile('qa-shots/renders-sheet.jpg')

console.log(files.length)
