import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
const logs = []
page.on('console', m => { if (m.type() !== 'log') logs.push(`${m.type()}: ${m.text().slice(0,200)}`) })
page.on('pageerror', e => logs.push('PAGEERROR ' + e.message))
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1000))
await page.evaluate(() => {
  const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
  b?.click()
})
await new Promise(r => setTimeout(r, 500))
await page.evaluate(() => {
  document.querySelector('#bike-configurator').scrollIntoView({ block: 'center' })
  const v = document.querySelector('#bike-configurator .viewer')
  if (v) v.style.aspectRatio = '16 / 10'
})
await new Promise(r => setTimeout(r, 8000))
await page.evaluate(() => {
  const buttons = [...document.querySelectorAll('#bike-configurator .view-chip')]
  const btn = buttons.find((b) => b.textContent.trim().toLowerCase().includes('side'))
  btn?.click()
})
await new Promise(r => setTimeout(r, 6000))
console.log(JSON.stringify(await page.evaluate(() => {
  const mv = document.querySelector('#bike-configurator .model-viewer')
  const canvas = document.querySelector('#bike-configurator canvas')
  const viewer = document.querySelector('#bike-configurator .viewer')
  const rect = viewer.getBoundingClientRect()
  return { loaded: mv?.dataset.loaded, canvas: !!canvas, canvasSize: canvas ? [canvas.width, canvas.height] : null, viewerRect: [rect.x, rect.y, rect.width, rect.height], active: document.querySelector('#bike-configurator .view-chip.is-active')?.textContent.trim(), scrollY: window.scrollY }
}), null, 2))
await page.screenshot({ path: 'qa-shots/bike-side-diag.png' })
console.log(logs.join('\n'))
await browser.close()
