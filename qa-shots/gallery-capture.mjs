import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})

const shots = [
  { section: '#configurator', label: 'Side', out: 'public/images/gallery/vx01-side.jpg' },
  { section: '#configurator', label: 'Detail', out: 'public/images/gallery/vx01-detail.jpg' },
  { section: '#configurator', label: 'Rear', out: 'public/images/gallery/vx01-rear.jpg' },
  { section: '#bike-configurator', label: 'Detail', out: 'public/images/gallery/r01-detail.jpg' },
  { section: '#bike-configurator', label: 'Side', out: 'public/images/gallery/r01-side.jpg' },
  { section: '#bike-configurator', label: 'Front', out: 'public/images/gallery/r01-front.jpg' },
]

for (const shot of shots) {
  const page = await browser.newPage()
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 2 })
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 900))
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
    b?.click()
  })
  await new Promise(r => setTimeout(r, 500))
  await page.evaluate((sel) => {
    document.querySelector(sel).scrollIntoView({ block: 'center' })
    const v = document.querySelector(`${sel} .viewer`)
    if (v) v.style.aspectRatio = '16 / 10'
    const chrome = document.querySelector(`${sel} .viewer__chrome`)
    if (chrome) chrome.style.visibility = 'hidden'
    const cap = document.querySelector(`${sel} .config__caption`)
    if (cap) cap.style.visibility = 'hidden'
  }, shot.section)
  await page.waitForFunction((sel) => {
    const el = document.querySelector(`${sel} .model-viewer`)
    return el && el.dataset.loaded === 'true' && el.querySelector('canvas')
  }, { timeout: 120000 }, shot.section)
  await new Promise(r => setTimeout(r, 2000))
  await page.evaluate((sel, label) => {
    const buttons = [...document.querySelectorAll(`${sel} .view-chip`)]
    const btn = buttons.find((b) => b.textContent.trim().toLowerCase().includes(label.toLowerCase()))
    btn?.click()
  }, shot.section, shot.label)
  await new Promise(r => setTimeout(r, 4500))
  const box = await page.evaluate((sel) => {
    const r = document.querySelector(`${sel} .viewer__model`).getBoundingClientRect()
    return { x: Math.round(r.x), y: Math.round(r.y + window.scrollY), width: Math.round(r.width), height: Math.round(r.height) }
  }, shot.section)
  await page.screenshot({ path: shot.out, type: 'jpeg', quality: 90, clip: box })
  console.log('saved', shot.out, fs.statSync(shot.out).size, box)
  await page.close()
}

await browser.close()
