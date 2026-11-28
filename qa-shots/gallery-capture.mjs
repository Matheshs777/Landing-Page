import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
import fs from 'node:fs'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})

const items = [
  { n: 1, out: 'public/images/gallery/vx01-side.jpg' },
  { n: 2, out: 'public/images/gallery/r01-detail.jpg' },
  { n: 3, out: 'public/images/gallery/vx01-detail.jpg' },
  { n: 4, out: 'public/images/gallery/r01-side.jpg' },
  { n: 5, out: 'public/images/gallery/vx01-rear.jpg' },
  { n: 6, out: 'public/images/gallery/r01-front.jpg' },
]

const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1000))
await page.evaluate(() => {
  const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
  b?.click()
})
await new Promise(r => setTimeout(r, 500))
await page.evaluate(() => {
  document.querySelectorAll('.gallery__caption').forEach((el) => { el.style.visibility = 'hidden' })
})

for (const item of items) {
  await page.evaluate((n) => {
    document.querySelector(`.gallery__item:nth-child(${n})`).scrollIntoView({ block: 'center' })
  }, item.n)
  await page.waitForFunction((n) => {
    const el = document.querySelector(`.gallery__item:nth-child(${n}) .model-viewer`)
    return el && el.dataset.loaded === 'true' && el.querySelector('canvas')
  }, { timeout: 120000 }, item.n)
  await new Promise(r => setTimeout(r, 8000))
  const rect = await page.evaluate((n) => {
    const r = document.querySelector(`.gallery__item:nth-child(${n}) .gallery__viewer`).getBoundingClientRect()
    return { x: r.x, y: r.y, width: r.width, height: r.height }
  }, item.n)
  const tmp = `qa-shots/tmp-gallery-${item.n}.png`
  await page.screenshot({ path: tmp })
  const meta = await sharp(tmp).metadata()
  const sx = meta.width / 1440
  await sharp(tmp)
    .extract({ left: Math.round(rect.x * sx), top: Math.round(rect.y * sx), width: Math.round(rect.width * sx), height: Math.round(rect.height * sx) })
    .resize(1280, 800, { fit: 'cover' })
    .jpeg({ quality: 90 })
    .toFile(item.out)
  console.log('saved', item.out, fs.statSync(item.out).size, rect)
}

await browser.close()
