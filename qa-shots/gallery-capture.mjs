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

async function capture(section, shots) {
  await page.evaluate((sel) => {
    document.querySelector(sel).scrollIntoView({ block: 'center' })
  }, section)
  await page.evaluate((sel) => {
    const v = document.querySelector(`${sel} .viewer`)
    if (v) v.style.aspectRatio = '16 / 10'
    const chrome = document.querySelector(`${sel} .viewer__chrome`)
    if (chrome) chrome.style.visibility = 'hidden'
    const cap = document.querySelector(`${sel} .config__caption`)
    if (cap) cap.style.visibility = 'hidden'
  }, section)
  await page.waitForFunction((sel) => {
    const el = document.querySelector(`${sel} .model-viewer`)
    return el && el.dataset.loaded === 'true' && el.querySelector('canvas')
  }, { timeout: 120000 }, section)
  await new Promise(r => setTimeout(r, 2500))

  for (const shot of shots) {
    await page.evaluate((sel, label) => {
      const buttons = [...document.querySelectorAll(`${sel} .view-chip`)]
      const btn = buttons.find((b) => b.textContent.trim().toLowerCase().includes(label.toLowerCase()))
      btn?.click()
    }, section, shot.label)
    await new Promise(r => setTimeout(r, 3200))
    const el = await page.$(`${section} .viewer__model`)
    if (!el) { console.log('missing viewer', section); continue }
    await el.screenshot({ path: shot.out, type: 'jpeg', quality: 90 })
    console.log('saved', shot.out, fs.statSync(shot.out).size)
  }
}

await capture('#configurator', [
  { label: 'Side', out: 'public/images/gallery/vx01-side.jpg' },
  { label: 'Detail', out: 'public/images/gallery/vx01-detail.jpg' },
  { label: 'Rear', out: 'public/images/gallery/vx01-rear.jpg' },
])

await capture('#bike-configurator', [
  { label: 'Detail', out: 'public/images/gallery/r01-detail.jpg' },
  { label: 'Side', out: 'public/images/gallery/r01-side.jpg' },
  { label: 'Front', out: 'public/images/gallery/r01-front.jpg' },
])

await browser.close()
