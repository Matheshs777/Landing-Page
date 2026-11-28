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
await page.evaluate(() => {
  const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
  b?.click()
})
await new Promise(r => setTimeout(r, 600))

async function shoot(anchor, out) {
  await page.evaluate((a) => {
    const el = document.querySelector(`${a} .viewer`)
    el.scrollIntoView({ block: 'center' })
  }, anchor)
  await new Promise(r => setTimeout(r, 2500))
  await page.waitForFunction((a) => {
    const el = document.querySelector(`${a} .model-viewer`)
    return el && el.dataset.loaded === 'true' && el.querySelector('canvas')
  }, { timeout: 90000 }, anchor)
  await new Promise(r => setTimeout(r, 3500))
  await page.evaluate((a) => {
    const chrome = document.querySelector(`${a} .viewer__chrome`)
    if (chrome) chrome.style.display = 'none'
  }, anchor)
  await new Promise(r => setTimeout(r, 500))
  const el = await page.$(`${anchor} .viewer__model`)
  await el.screenshot({ path: out, type: 'jpeg', quality: 88 })
  await page.evaluate((a) => {
    const chrome = document.querySelector(`${a} .viewer__chrome`)
    if (chrome) chrome.style.display = ''
  }, anchor)
  console.log('saved', out, fs.statSync(out).size)
}

await shoot('#configurator', 'public/images/car-poster.jpg')
await shoot('#bike-configurator', 'public/images/bike-poster.jpg')
await browser.close()

await sharp('public/images/car-poster.jpg').resize(1200, 630, { fit: 'cover', position: 'centre' }).jpeg({ quality: 84 }).toFile('public/images/og.jpg')
console.log('og', fs.statSync('public/images/og.jpg').size)
