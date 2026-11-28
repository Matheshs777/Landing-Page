import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
const logs = []
page.on('console', m => { if (m.type() === 'error') logs.push(m.text().slice(0,200)) })
page.on('pageerror', e => logs.push('PAGEERROR ' + e.message))
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1000))
await page.evaluate(() => {
  const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
  b?.click()
})
await new Promise(r => setTimeout(r, 500))
await page.evaluate(() => {
  const el = document.querySelector('#bike-configurator .viewer')
  el.scrollIntoView({ block: 'center' })
})
await new Promise(r => setTimeout(r, 4000))
console.log('loaded states', await page.evaluate(() => [...document.querySelectorAll('#bike-configurator .model-viewer')].map(e => ({loaded: e.dataset.loaded, canvases: e.querySelectorAll('canvas').length, poster: !!e.querySelector('.model-viewer__poster')}))))
await new Promise(r => setTimeout(r, 12000))
console.log('after wait', await page.evaluate(() => ({ canvases: document.querySelectorAll('canvas').length, loaded: document.querySelectorAll('.model-viewer[data-loaded="true"]').length, fallbacks: [...document.querySelectorAll('.model-viewer--fallback')].map(e=>e.textContent.trim().slice(0,80)) })))
await page.screenshot({ path: 'qa-shots/webgl-bike.png' })
console.log(logs.join('\n'))
await browser.close()
