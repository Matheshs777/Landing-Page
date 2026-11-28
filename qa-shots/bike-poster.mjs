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
await page.evaluate(() => {
  const el = document.querySelector('#bike-configurator .viewer')
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 120)
})
await new Promise(r => setTimeout(r, 3000))
await page.waitForFunction(() => {
  const el = document.querySelector('#bike-configurator .model-viewer')
  return el && el.dataset.loaded === 'true' && el.querySelector('canvas')
}, { timeout: 90000 })
await new Promise(r => setTimeout(r, 6000))
await page.evaluate(() => {
  const chrome = document.querySelector('#bike-configurator .viewer__chrome')
  if (chrome) chrome.style.visibility = 'hidden'
})
await new Promise(r => setTimeout(r, 500))
const box = await page.evaluate(() => {
  const r = document.querySelector('#bike-configurator .viewer').getBoundingClientRect()
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }
})
await page.screenshot({ path: 'qa-shots/bike-viewport.png' })
await sharp('qa-shots/bike-viewport.png').extract({ left: box.x, top: box.y, width: box.width, height: box.height }).jpeg({ quality: 88 }).toFile('public/images/bike-poster.jpg')
console.log(box, fs.statSync('public/images/bike-poster.jpg').size)
await browser.close()
