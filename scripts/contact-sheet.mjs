import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const dir = 'qa-shots/candidates'
fs.mkdirSync(dir, { recursive: true })

const ids = [
  ['car1','photo-1503376780353-7e6692767b70'],
  ['car2','photo-1544636331-e26879cd4d9b'],
  ['car3','photo-1552519507-da3b142c6e3d'],
  ['car4','photo-1555215695-3004980ad54e'],
  ['car5','photo-1580273916550-e323be2ae537'],
  ['car6','photo-1618843479313-40f8afb4b4d8'],
  ['car7','photo-1553440569-bcc63803a83d'],
  ['car8','photo-1525609004556-c46c7d6cf023'],
  ['car9','photo-1511919884226-fd3cad34687c'],
  ['car10','photo-1494905998402-395d579af36f'],
  ['car11','photo-1542362567-b07e54358753'],
  ['car12','photo-1502877338535-766e1452684a'],
  ['bike1','photo-1558981806-ec527fa84c39'],
  ['bike2','photo-1568772585407-9361f9bf3a87'],
  ['bike3','photo-1526726538690-5cbf956ae2fd'],
  ['bike4','photo-1449426468159-d96dbf08f19f'],
  ['bike5','photo-1591637333184-19aa84b3e01f'],
  ['bike6','photo-1609630875171-b1321377ee65'],
  ['det1','photo-1486262715619-67b85e0b08d3'],
  ['det2','photo-1493238792000-8113da705763'],
  ['det3','photo-1503736334956-4c8f8e92946d'],
  ['det4','photo-1517524008697-84bbe3c3fd98'],
  ['det5','photo-1486496572940-2bb2341fdbdf'],
  ['det6','photo-1547744152-14d985cb937f'],
]

const downloaded = []
for (const [name, id] of ids) {
  const file = path.join(dir, `${name}.jpg`)
  try {
    const res = await fetch(`https://images.unsplash.com/${id}?auto=format&fit=crop&w=640&q=70`)
    if (!res.ok) { console.log('FAIL', name, res.status); continue }
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
    downloaded.push({ name, file })
  } catch (e) { console.log('ERR', name, e.message) }
}

const cols = 6
const tw = 300, th = 200, labelH = 24
const rows = Math.ceil(downloaded.length / cols)
const composites = []
for (let i = 0; i < downloaded.length; i++) {
  const { name, file } = downloaded[i]
  const buf = await sharp(file).resize(tw, th, { fit: 'cover' }).toBuffer()
  const label = Buffer.from(`<svg width="${tw}" height="${labelH}"><rect width="100%" height="100%" fill="#111"/><text x="8" y="16" font-family="monospace" font-size="13" fill="#fff">${name}</text></svg>`)
  composites.push({ input: buf, left: (i % cols) * tw, top: Math.floor(i / cols) * (th + labelH) })
  composites.push({ input: label, left: (i % cols) * tw, top: Math.floor(i / cols) * (th + labelH) + th })
}
await sharp({ create: { width: cols * tw, height: rows * (th + labelH), channels: 3, background: '#222' } })
  .composite(composites)
  .jpeg({ quality: 82 })
  .toFile('qa-shots/contact-sheet.jpg')
console.log('downloaded', downloaded.length)
