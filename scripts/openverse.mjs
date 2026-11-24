import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const dir = 'qa-shots/openverse'
fs.mkdirSync(dir, { recursive: true })

const queries = [
  'car engine macro',
  'car brake disc',
  'car headlight detail',
  'supercar studio',
  'motorcycle rider road',
  'motorcycle engine detail',
  'car cockpit interior',
  'carbon fiber texture',
  'wet asphalt night',
  'car design sketch',
]

const all = []
for (const q of queries) {
  const url = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license_type=commercial&page_size=8&mature=false`
  try {
    const res = await fetch(url)
    if (!res.ok) { console.log('FAIL', q, res.status); continue }
    const json = await res.json()
    for (const r of json.results ?? []) {
      all.push({
        q,
        id: r.id,
        title: r.title,
        creator: r.creator,
        license: r.license,
        licenseUrl: r.license_url,
        source: r.source,
        landing: r.foreign_landing_url,
        url: r.url,
        thumb: r.thumbnail,
        w: r.width,
        h: r.height,
      })
    }
  } catch (e) { console.log('ERR', q, e.message) }
}

fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(all, null, 2))

const downloaded = []
for (let i = 0; i < all.length; i++) {
  const item = all[i]
  const file = path.join(dir, `c${String(i).padStart(3, '0')}.jpg`)
  try {
    const res = await fetch(item.thumb)
    if (!res.ok) continue
    fs.writeFileSync(file, Buffer.from(await res.arrayBuffer()))
    downloaded.push({ ...item, file, n: i })
  } catch {}
}

const cols = 8
const tw = 220, th = 140, labelH = 18
const rows = Math.ceil(downloaded.length / cols)
const comps = []
for (let i = 0; i < downloaded.length; i++) {
  const d = downloaded[i]
  const buf = await sharp(d.file).resize(tw, th, { fit: 'cover' }).toBuffer()
  const label = Buffer.from(
    `<svg width="${tw}" height="${labelH}"><rect width="100%" height="100%" fill="#111"/><text x="5" y="13" font-family="monospace" font-size="10" fill="#fff">c${String(d.n).padStart(3,'0')} ${d.q.slice(0,18)}</text></svg>`
  )
  const left = (i % cols) * tw
  const top = Math.floor(i / cols) * (th + labelH)
  comps.push({ input: buf, left, top })
  comps.push({ input: label, left, top: top + th })
}
await sharp({ create: { width: cols * tw, height: rows * (th + labelH), channels: 3, background: '#222' } })
  .composite(comps).jpeg({ quality: 78 }).toFile('qa-shots/openverse-sheet.jpg')
console.log('total', all.length, 'downloaded', downloaded.length)
