import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:4173'
const sizes = [
  { w: 360, h: 780, name: '360' },
  { w: 390, h: 844, name: '390' },
  { w: 768, h: 1024, name: '768' },
  { w: 1024, h: 768, name: '1024' },
  { w: 1440, h: 900, name: '1440' },
  { w: 1920, h: 1080, name: '1920' },
]

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--enable-unsafe-swiftshader',
    '--use-gl=angle',
    '--use-angle=swiftshader',
    '--disable-dev-shm-usage',
    '--no-sandbox',
  ],
})

const report = []

for (const size of sizes) {
  const page = await browser.newPage()
  await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 1 })
  const errors = []
  const failed = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text().slice(0, 300))
  })
  page.on('pageerror', (err) => errors.push(`PAGEERROR ${err.message}`.slice(0, 300)))
  page.on('requestfailed', (req) => failed.push(`${req.url()} ${req.failure()?.errorText}`))
  page.on('response', (res) => {
    if (res.status() >= 400) failed.push(`${res.status()} ${res.url()}`)
  })

  await page.goto(`${BASE}/`, { waitUntil: 'networkidle2', timeout: 60000 })
  await new Promise((r) => setTimeout(r, 1500))

  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += Math.round(size.h * 0.7)) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await new Promise((r) => setTimeout(r, 160))
  }
  await new Promise((r) => setTimeout(r, 2200))
  await page.evaluate(() => window.scrollTo(0, 0))
  await new Promise((r) => setTimeout(r, 800))

  const data = await page.evaluate(() => {
    const q = (s) => document.querySelector(s)
    const qa = (s) => [...document.querySelectorAll(s)]
    const links = qa('a[href^="/#"], a[href^="#"]').map((a) => a.getAttribute('href'))
    const missing = [...new Set(links)].filter((href) => {
      if (!href || href === '#') return false
      const id = href.split('#')[1]
      return id && !document.getElementById(id)
    })
    const hidden = qa('.line-reveal__inner, .model-viewer, .band__title, .brand-intro__aside')
      .filter((el) => {
        const style = getComputedStyle(el)
        return Number(style.opacity) < 0.05
      })
      .map((el) => el.className)
    const gallery = q('.gallery__grid')
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      scrollHeight: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      missingAnchors: missing,
      hidden,
      canvases: qa('canvas').length,
      viewers: qa('.model-viewer').length,
      loadedViewers: qa('.model-viewer[data-loaded="true"]').length,
      loaders: qa('.model-viewer__loader').length,
      fallbacks: qa('.model-viewer--fallback').length,
      navToggle: q('.nav__toggle') ? getComputedStyle(q('.nav__toggle')).display : null,
      navLinks: q('.nav__links') ? getComputedStyle(q('.nav__links')).display : null,
      galleryCols: gallery ? getComputedStyle(gallery).gridTemplateColumns : null,
      galleryItemCols: q('.gallery__item') ? getComputedStyle(q('.gallery__item')).gridColumn : null,
      specsCols: q('.specs__groups') ? getComputedStyle(q('.specs__groups')).gridTemplateColumns : null,
      viewsCols: q('.views') ? getComputedStyle(q('.views')).gridTemplateColumns : null,
      heroTitleSize: q('.hero__title') ? getComputedStyle(q('.hero__title')).fontSize : null,
      consent: q('.consent') ? getComputedStyle(q('.consent')).display : null,
    }
  })

  await page.screenshot({ path: `qa-shots/v2-${size.name}-top.png` })
  if (size.name === '390' || size.name === '1440' || size.name === '768') {
    await page.screenshot({ path: `qa-shots/v2-${size.name}-full.png`, fullPage: true })
  }

  report.push({ size: size.name, ...data, errors: [...new Set(errors)], failed: [...new Set(failed)] })
  await page.close()
}

await browser.close()
fs.writeFileSync('qa-shots/v2-report.json', JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
