import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:5173'
const OUT = path.resolve('qa-shots')

const [widthArg, heightArg, tagArg] = process.argv.slice(2)
const width = Number(widthArg) || 1440
const height = Number(heightArg) || 900
const tag = tagArg || `${width}`

fs.mkdirSync(OUT, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--no-sandbox',
    '--enable-unsafe-swiftshader',
    '--use-angle=swiftshader',
    '--hide-scrollbars',
  ],
})

const page = await browser.newPage()
await page.setViewport({ width, height, deviceScaleFactor: 1 })

const errors = []
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(`console: ${message.text()}`)
})
page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))

await page.goto(BASE, { waitUntil: 'networkidle0' })
await page.evaluate(() => document.fonts.ready)
await new Promise((resolve) => setTimeout(resolve, 1800))

const shot = async (name, options = {}) => {
  await page.screenshot({ path: path.join(OUT, `${tag}-${name}.png`), ...options })
}

await shot('hero')

const metrics = await page.evaluate(() => {
  const box = (selector) => {
    const element = document.querySelector(selector)
    if (!element) return null
    const rect = element.getBoundingClientRect()
    return {
      top: Math.round(rect.top + window.scrollY),
      left: Math.round(rect.left),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    }
  }

  const overflowing = [...document.querySelectorAll('body *')]
    .filter((element) => {
      const rect = element.getBoundingClientRect()
      const style = getComputedStyle(element)
      if (style.position === 'fixed' || style.position === 'absolute') return false
      return rect.right > window.innerWidth + 2 || rect.left < -2
    })
    .slice(0, 20)
    .map((element) => ({
      tag: element.tagName,
      className: String(element.className || '').slice(0, 80),
      left: Math.round(element.getBoundingClientRect().left),
      right: Math.round(element.getBoundingClientRect().right),
    }))

  return {
    viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
    scrollHeight: document.documentElement.scrollHeight,
    hero: box('.hero'),
    heroTitle: box('.hero__title'),
    heroStage: box('.hero__stage'),
    canvases: document.querySelectorAll('canvas').length,
    sections: ['features', 'sound', 'specs', 'colors', 'reviews', 'preorder'].map((id) => ({
      id,
      ...box(`#${id}`),
    })),
    overflowing,
  }
})

for (const id of ['features', 'sound', 'specs', 'colors', 'reviews', 'preorder']) {
  await page.evaluate((sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ block: 'start', behavior: 'instant' })
  }, id)
  await new Promise((resolve) => setTimeout(resolve, 1600))
  await shot(id)
}

await page.evaluate(() => window.scrollTo(0, 0))
await new Promise((resolve) => setTimeout(resolve, 600))
await shot('full', { fullPage: true })

const finalState = await page.evaluate(() => ({
  canvases: document.querySelectorAll('canvas').length,
  bodyOverflowX: getComputedStyle(document.body).overflowX,
  sceneHints: document.querySelectorAll('.scene-hint').length,
}))

await browser.close()
console.log(JSON.stringify({ tag, metrics, finalState, errors }, null, 2))
