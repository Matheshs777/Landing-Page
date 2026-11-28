import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1200))
await page.evaluate(() => {
  const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
  b?.click()
})
await new Promise(r => setTimeout(r, 600))

const items = [
  { sel: '.gallery__item:nth-child(1)', out: 'public/images/gallery/vx01-side.jpg' },
  { sel: '.gallery__item:nth-child(2)', out: 'public/images/gallery/r01-detail.jpg' },
  { sel: '.gallery__item:nth-child(3)', out: 'public/images/gallery/vx01-detail.jpg' },
  { sel: '.gallery__item:nth-child(4)', out: 'public/images/gallery/r01-side.jpg' },
  { sel: '.gallery__item:nth-child(5)', out: 'public/images/gallery/vx01-rear.jpg' },
  { sel: '.gallery__item:nth-child(6)', out: 'public/images/gallery/r01-front.jpg' },
]

for (const item of items) {
  await page.evaluate((sel) => {
    document.querySelector(sel).scrollIntoView({ block: 'center' })
  }, item.sel)
  await page.waitForFunction((sel) => {
    const el = document.querySelector(`${sel} .model-viewer`)
    return el && el.dataset.loaded === 'true' && el.querySelector('canvas')
  }, { timeout: 120000 }, item.sel)
  await new Promise(r => setTimeout(r, 3500))
  const el = await page.$(`${item.sel} .gallery__viewer`)
  if (!el) { console.log('missing', item.sel); continue }
  await el.screenshot({ path: item.out, type: 'jpeg', quality: 90 })
  console.log('saved', item.out, fs.statSync(item.out).size)
}

await browser.close()
