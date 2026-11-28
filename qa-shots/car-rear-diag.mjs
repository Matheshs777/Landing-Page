import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1000))
await page.evaluate(() => {
  const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
  b?.click()
})
await new Promise(r => setTimeout(r, 500))
await page.evaluate(() => {
  document.querySelector('#configurator').scrollIntoView({ block: 'center' })
  const v = document.querySelector('#configurator .viewer')
  if (v) v.style.aspectRatio = '16 / 10'
})
await new Promise(r => setTimeout(r, 8000))
await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('#configurator .view-chip')]
  const btn = buttons.find((b) => b.textContent.trim().toLowerCase().includes('rear'))
  btn?.click()
})
await new Promise(r => setTimeout(r, 6000))
await page.screenshot({ path: 'qa-shots/car-rear-diag.png' })
await browser.close()
