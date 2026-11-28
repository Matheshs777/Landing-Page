import puppeteer from 'puppeteer-core'
import sharp from 'sharp'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})
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
  document.querySelector('.gallery__item:nth-child(5)').scrollIntoView({ block: 'center' })
  document.querySelectorAll('.gallery__caption').forEach(el => { el.style.visibility = 'hidden' })
})
await page.waitForFunction(() => {
  const el = document.querySelector('.gallery__item:nth-child(5) .model-viewer')
  return el && el.dataset.loaded === 'true' && el.querySelector('canvas')
}, { timeout: 120000 })
await new Promise(r => setTimeout(r, 8000))
const rect = await page.evaluate(() => {
  const r = document.querySelector('.gallery__item:nth-child(5) .gallery__viewer').getBoundingClientRect()
  return { x: r.x, y: r.y, width: r.width, height: r.height }
})
await page.screenshot({ path: 'qa-shots/gallery-rear-viewport.png' })
const meta = await sharp('qa-shots/gallery-rear-viewport.png').metadata()
const sx = meta.width / 1440
await sharp('qa-shots/gallery-rear-viewport.png')
  .extract({ left: Math.round(rect.x * sx), top: Math.round(rect.y * sx), width: Math.round(rect.width * sx), height: Math.round(rect.height * sx) })
  .resize(1280, 800, { fit: 'cover' })
  .jpeg({ quality: 90 })
  .toFile('public/images/gallery/vx01-rear-gallery.jpg')
console.log(rect)
await browser.close()
