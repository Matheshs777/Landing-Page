import puppeteer from 'puppeteer-core'
import fs from 'node:fs'

/**
 * Layout / interaction QA pass.
 *
 * WebGL is disabled so this run exercises the DOM, responsive rules, routing,
 * consent and the no-WebGL fallback deterministically. The live 3D path is
 * checked separately in a GPU browser; software WebGL here would stall the
 * renderer and crash the headless session.
 */

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:4173'
const OUT = 'qa-shots'

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
    '--disable-3d-apis',
    '--disable-webgl',
    '--disable-webgl2',
    '--disable-dev-shm-usage',
    '--no-sandbox',
  ],
})

const report = []
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

function watch(page, sink) {
  page.on('console', (msg) => {
    if (msg.type() === 'error') sink.errors.push(msg.text().slice(0, 240))
  })
  page.on('pageerror', (err) => sink.errors.push(`PAGEERROR ${err.message}`.slice(0, 240)))
  page.on('requestfailed', (req) => {
    const failure = req.failure()?.errorText ?? ''
    if (!failure.includes('ERR_ABORTED')) sink.failed.push(`${req.url()} ${failure}`)
  })
  page.on('response', (res) => {
    if (res.status() >= 400) sink.failed.push(`${res.status()} ${res.url()}`)
  })
}

async function measure(page) {
  return page.evaluate(() => {
    const q = (s) => document.querySelector(s)
    const qa = (s) => [...document.querySelectorAll(s)]
    const links = qa('a[href^="/#"], a[href^="#"]').map((a) => a.getAttribute('href'))
    const missing = [...new Set(links)].filter((href) => {
      if (!href || href === '#') return false
      const id = href.split('#')[1]
      return id && !document.getElementById(id)
    })
    const hidden = qa('.line-reveal__inner, .model-viewer, .band__title, .brand-intro__aside')
      .filter((el) => Number(getComputedStyle(el).opacity) < 0.05)
      .map((el) => el.className)
    const gallery = q('.gallery__grid')
    const consent = q('.consent')
    const consentRect = consent?.getBoundingClientRect()
    return {
      scrollWidth: document.documentElement.scrollWidth,
      innerWidth: window.innerWidth,
      scrollHeight: document.documentElement.scrollHeight,
      overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
      missingAnchors: missing,
      hidden,
      viewers: qa('.model-viewer').length,
      fallbacks: qa('.model-viewer--fallback').length,
      navToggle: q('.nav__toggle') ? getComputedStyle(q('.nav__toggle')).display : null,
      navLinks: q('.nav__links') ? getComputedStyle(q('.nav__links')).display : null,
      galleryCols: gallery ? getComputedStyle(gallery).gridTemplateColumns : null,
      specsCols: q('.specs__groups')
        ? getComputedStyle(q('.specs__groups')).gridTemplateColumns
        : null,
      viewsCols: q('.views') ? getComputedStyle(q('.views')).gridTemplateColumns : null,
      heroTitleSize: q('.hero__title')
        ? getComputedStyle(q('.hero__title')).fontSize
        : null,
      consent: consentRect
        ? {
            left: Math.round(consentRect.left),
            right: Math.round(consentRect.right),
            top: Math.round(consentRect.top),
            bottom: Math.round(consentRect.bottom),
            fitsX: consentRect.left >= -1 && consentRect.right <= window.innerWidth + 1,
            fitsY: consentRect.bottom <= window.innerHeight + 1,
          }
        : null,
    }
  })
}

for (const size of sizes) {
  const page = await browser.newPage()
  const sink = { errors: [], failed: [] }
  watch(page, sink)
  await page.setViewport({ width: size.w, height: size.h, deviceScaleFactor: 1 })
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded', timeout: 30000 })
  await page.evaluate(() => document.fonts?.ready)
  await sleep(1100)

  const height = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let y = 0; y < height; y += Math.round(size.h * 0.62)) {
    await page.evaluate((v) => window.scrollTo(0, v), y)
    await sleep(90)
  }
  await sleep(1400)
  await page.evaluate(() => window.scrollTo(0, 0))
  await sleep(700)

  const data = await measure(page)
  await page.screenshot({ path: `${OUT}/v2-${size.name}-top.png` })
  if (['390', '1440', '1920'].includes(size.name)) {
    await page.screenshot({ path: `${OUT}/v2-${size.name}-full.png`, fullPage: true })
  }

  report.push({
    size: size.name,
    ...data,
    errors: [...new Set(sink.errors)],
    failed: [...new Set(sink.failed)],
  })
  await page.close()
}

// ---- route + interaction checks (390) ----
const page = await browser.newPage()
const sink = { errors: [], failed: [] }
watch(page, sink)
await page.setViewport({ width: 390, height: 844, deviceScaleFactor: 1 })

const flow = {}

await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
await page.evaluate(() => document.fonts?.ready)
await sleep(900)

// Consent: choose essential only, reload, reopen from the footer.
const hasBanner = await page.$('.consent')
flow.bannerOnFirstVisit = Boolean(hasBanner)
if (hasBanner) {
  await page.evaluate(() => {
    const button = [...document.querySelectorAll('.consent button')].find((el) =>
      el.textContent.trim().toLowerCase().startsWith('essential'),
    )
    button?.click()
  })
  await sleep(700)
}
flow.bannerHiddenAfterChoice = !(await page.$('.consent'))
flow.storedChoice = await page.evaluate(() =>
  JSON.parse(localStorage.getItem('novaris.consent.v1') ?? 'null'),
)
await page.reload({ waitUntil: 'domcontentloaded' })
await sleep(800)
flow.bannerHiddenAfterReload = !(await page.$('.consent'))
flow.analyticsOff = await page.evaluate(() => !window.__novarisAnalytics)

// Mobile drawer
await page.evaluate(() =>
  document.querySelector('.nav__toggle')?.scrollIntoView({ block: 'center' }),
)
await page.click('.nav__toggle')
await sleep(600)
flow.drawerOpen = await page.evaluate(() => {
  const menu = document.querySelector('.menu')
  return Boolean(menu) && getComputedStyle(menu).opacity !== '0'
})
flow.drawerScrollLocked = await page.evaluate(
  () => getComputedStyle(document.body).overflow === 'hidden',
)
await page.click('.menu__link')
await sleep(900)
flow.drawerClosedAfterNav = !(await page.$('.menu'))

// Reopen from the footer
await page.evaluate(() => {
  const button = [...document.querySelectorAll('button')].find((el) =>
    el.textContent.trim().toLowerCase() === 'cookie settings',
  )
  button?.scrollIntoView({ block: 'center' })
})
await sleep(300)
await page.evaluate(() => {
  const button = [...document.querySelectorAll('button')].find((el) =>
    el.textContent.trim().toLowerCase() === 'cookie settings',
  )
  button?.click()
})
await sleep(600)
flow.bannerReopenedFromFooter = Boolean(await page.$('.consent'))

// Accept all, verify the analytics stub flips on.
await page.evaluate(() => {
  const button = [...document.querySelectorAll('.consent button')].find((el) =>
    el.textContent.trim().toLowerCase().startsWith('accept'),
  )
  button?.click()
})
await sleep(700)
flow.analyticsOnAfterAccept = await page.evaluate(
  () => window.__novarisAnalytics === true,
)
flow.bannerHiddenAfterAccept = !(await page.$('.consent'))

// Routes
const routes = [
  ['/privacy', 'Privacy'],
  ['/cookies', 'Cookies'],
  ['/credits', 'Credits'],
  ['/missing-page', '404'],
  ['/error', '500'],
]
flow.routes = {}
for (const [path, label] of routes) {
  await page.goto(`${BASE}${path}`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts?.ready)
  await sleep(500)
  flow.routes[path] = await page.evaluate(() => ({
    h1: document.querySelector('h1')?.textContent.trim().replace(/\s+/g, ' ').slice(0, 90),
    overflowX: document.documentElement.scrollWidth > window.innerWidth + 1,
    title: document.title,
  }))
  await page.screenshot({
    path: `${OUT}/v2-route-${label.toLowerCase().replace(/\s+/g, '-')}.png`,
  })
}

flow.errors = [...new Set(sink.errors)]
flow.failed = [...new Set(sink.failed)]
report.push({ flows: flow })

await browser.close()
fs.writeFileSync(`${OUT}/v2-report.json`, JSON.stringify(report, null, 2))
console.log(JSON.stringify(report, null, 2))
