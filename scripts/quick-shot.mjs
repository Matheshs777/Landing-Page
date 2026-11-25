import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:5173'
const OUT = path.resolve('qa-shots/quick')
fs.mkdirSync(OUT, { recursive: true })

const [, , render = 'car', view = 'hero', width = '1400', height = '900', name] =
  process.argv
const paint = process.env.PAINT

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--no-sandbox',
    '--enable-unsafe-swiftshader',
    '--use-angle=swiftshader',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
  ],
})
const page = await browser.newPage()
page.on('pageerror', (error) => console.log('PAGEERROR', error.message))
page.on('console', (message) => {
  if (message.type() === 'error') console.log('CONSOLE', message.text())
})
await page.setViewport({ width: Number(width), height: Number(height) })
await page.goto(`${BASE}/?render=${render}&view=${view}${paint ? `&paint=${paint}` : ''}`, {
  waitUntil: 'networkidle0',
  timeout: 120000,
})
try {
  await page.waitForFunction(
    () => document.documentElement.dataset.renderReady === 'true',
    { timeout: 90000 },
  )
} catch {
  console.log('TIMEOUT waiting for render')
}
await new Promise((resolve) => setTimeout(resolve, 2200))
const file = path.join(OUT, `${name ?? `${render}-${view}`}.png`)
await page.screenshot({ path: file })
console.log('saved', file)
await browser.close()
