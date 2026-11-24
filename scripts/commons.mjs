import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const dir = 'qa-shots/commons'
fs.mkdirSync(dir, { recursive: true })

const queries = [
  'car engine bay detail',
  'brake disc caliper',
  'carbon fibre weave',
  'car headlight detail',
  'motorcycle engine detail',
  'wet road night lights',
  'car interior dashboard',
  'wind tunnel car',
]

const all = []
for (const q of queries) {
  const api = new URL('https://commons.wikimedia.org/w/api.php')
  api.search = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${q}`,
    gsrnamespace: '6',
    gsrlimit: '8',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '640',
  })
  try {
    const res = await fetch(api, { headers: { 'User-Agent': 'NovarisDesignStudy/1.0 (contact: studio@novaris.example)' } })
    if (!res.ok) { console.log('FAIL', q, res.status); continue }
    const json = await res.json()
    for (const page of Object.values(json.query?.pages ?? {})) {
      const info = page.imageinfo?.[0]
      if (!info) continue
      const meta = info.extmetadata ?? {}
      all.push({
        q,
        title: page.title,
        thumb: info.thumburl,
        url: info.url,
        page: info.descriptionurl,
        w: info.width,
        h: info.height,
        license: meta.LicenseShortName?.value,
        licenseUrl: meta.LicenseUrl?.value,
        artist: (meta.Artist?.value ?? '').replace(/<[^>]+>/g, '').trim(),
        credit: (meta.Credit?.value ?? '').replace(/<[^>]+>/g, '').trim(),
      })
    }
  } catch (e) { console.log('ERR', q, e.message) }
}

fs.writeFileSync(path.join(dir, 'meta.json'), JSON.stringify(all, null, 2))

const downloaded = []
for (let i = 0; i < all.length; i++) {
  const item = all[i]
  const file = path.join(dir, `m${String(i).padStart(3, '0')}.jpg`)
  try {
    const res = await fetch(item.thumb, { headers: { 'User-Agent': 'NovarisDesignStudy/1.0' } })
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
    `<svg width="${tw}" height="${labelH}"><rect width="100%" height="100%" fill="#111"/><text x="5" y="13" font-family="monospace" font-size="10" fill="#fff">m${String(d.n).padStart(3, '0')} ${d.q.slice(0, 20)}</text></svg>`,
  )
  const left = (i % cols) * tw
  const top = Math.floor(i / cols) * (th + labelH)
  comps.push({ input: buf, left, top })
  comps.push({ input: label, left, top: top + th })
}
await sharp({ create: { width: cols * tw, height: rows * (th + labelH), channels: 3, background: '#222' } })
  .composite(comps).jpeg({ quality: 78 }).toFile('qa-shots/commons-sheet.jpg')
console.log('total', all.length, 'downloaded', downloaded.length)
