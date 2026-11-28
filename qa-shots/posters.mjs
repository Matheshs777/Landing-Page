import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
import sharp from 'sharp'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1200))
// Dismiss consent so it does not overlay the viewers.
await page.evaluate(() => {
  const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
  b?.click()
})
await new Promise(r => setTimeout(r, 600))

async function shoot(anchor, selector, out) {
  await page.evaluate((a) => {
    const el = document.querySelector(a)
    window.scrollTo(0, el.getBoundingClientRect().top + scrollY)
  }, anchor)
  await new Promise(r => setTimeout(r, 1500))
  await page.waitForFunction((s) => {
    const el = document.querySelector(s)
    return el && el.dataset.loaded === 'true'
  }, { timeout: 45000 }, selector).catch(() => console.log('timeout', selector))
  await new Promise(r => setTimeout(r, 1200))
  const el = await page.$(selector)
  if (!el) { console.log('missing', selector); return }
  await el.screenshot({ path: out, type: 'jpeg', quality: 86 })
  console.log('saved', out)
}

await shoot('#configurator', '#configurator .viewer__model', 'public/images/car-poster.jpg')
await shoot('#bike-configurator', '#bike-configurator .viewer__model', 'public/images/bike-poster.jpg')
await browser.close()

await sharp('public/images/car-poster.jpg').resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 82 }).toFile('public/images/og.jpg')
console.log('og done', fs.statSync('public/images/car-poster.jpg').size, fs.statSync('public/images/bike-poster.jpg').size, fs.statSync('public/images/og.jpg').size)
