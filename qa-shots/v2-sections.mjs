import puppeteer from 'puppeteer-core'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:4173'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: ['--disable-3d-apis', '--disable-webgl', '--disable-webgl2', '--no-sandbox'],
})

const targets = [
  ['brand', '#brand'],
  ['automobile', '#automobile'],
  ['superbike', '#superbike'],
  ['configurator', '#configurator'],
  ['engineering', '#engineering'],
  ['gallery', '#gallery'],
  ['philosophy', '#philosophy'],
  ['footer', '#footer'],
]

for (const [w, h, name] of [
  [390, 844, '390'],
  [1440, 900, '1440'],
]) {
  const page = await browser.newPage()
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 })
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await page.evaluate(() => document.fonts?.ready)
  await sleep(900)
  // Clear consent for clean section shots.
  await page.evaluate(() => {
    const button = [...document.querySelectorAll('.consent button')].find((el) =>
      el.textContent.trim().toLowerCase().startsWith('essential'),
    )
    button?.click()
  })
  await sleep(700)

  for (const [label, selector] of targets) {
    const exists = await page.$(selector)
    if (!exists) {
      console.log(`missing ${selector}`)
      continue
    }
    await page.evaluate((sel) => {
      const el = document.querySelector(sel)
      const top = el.getBoundingClientRect().top + window.scrollY
      window.scrollTo(0, top)
    }, selector)
    await sleep(900)
    await page.screenshot({ path: `qa-shots/v2-${name}-${label}.png` })
  }
  await page.close()
}

await browser.close()
console.log('done')
