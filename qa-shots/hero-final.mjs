import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})

async function open(width, height, dpr) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: dpr })
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 1000))
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
    b?.click()
  })
  await page.waitForFunction(() => document.querySelector('.hero__viewer')?.dataset.loaded === 'true', { timeout: 120000 })
  await new Promise(r => setTimeout(r, 3500))
  return page
}

const page = await open(1440, 900, 1)
await page.screenshot({ path: 'qa-shots/final-hero-3d.png' })
await page.close()

const poster = await open(1920, 1080, 1)
await poster.evaluate(() => {
  for (const sel of ['.hero__content', '.hero__scrim', '.hero__glow', '.hero__grain', '.hero__rail', '.hero__foot', '.nav', '.ticker']) {
    const el = document.querySelector(sel)
    if (el) el.style.visibility = 'hidden'
  }
})
await new Promise(r => setTimeout(r, 500))
const el = await poster.$('.hero__viewer')
await el.screenshot({ path: 'public/images/hero-poster.jpg', type: 'jpeg', quality: 88 })
console.log('poster', fs.statSync('public/images/hero-poster.jpg').size)
await poster.close()
await browser.close()
