import puppeteer from 'puppeteer-core'
import fs from 'node:fs'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 900, height: 1200, deviceScaleFactor: 1 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1000))
await page.evaluate(() => {
  const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
  b?.click()
})
await page.waitForFunction(() => document.querySelector('.hero__viewer')?.dataset.loaded === 'true', { timeout: 120000 })
await new Promise(r => setTimeout(r, 3000))
await page.evaluate(() => {
  for (const sel of ['.hero__content', '.hero__scrim', '.hero__glow', '.hero__grain', '.hero__rail', '.hero__foot', '.nav', '.ticker']) {
    const el = document.querySelector(sel)
    if (el) el.style.visibility = 'hidden'
  }
})
await new Promise(r => setTimeout(r, 500))
const el = await page.$('.hero__viewer')
await el.screenshot({ path: 'public/images/hero-poster-mobile.jpg', type: 'jpeg', quality: 88 })
console.log('poster', fs.statSync('public/images/hero-poster-mobile.jpg').size)
await browser.close()
