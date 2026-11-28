import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
const logs = []
page.on('console', m => logs.push(`${m.type()}: ${m.text().slice(0,160)}`))
page.on('pageerror', e => logs.push(`PAGEERROR ${e.message}`))
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 18000))
console.log(JSON.stringify(await page.evaluate(() => ({
  canvases: document.querySelectorAll('canvas').length,
  loaded: document.querySelectorAll('.model-viewer[data-loaded="true"]').length,
  fallbacks: [...document.querySelectorAll('.model-viewer--fallback')].map(e => e.textContent.trim().slice(0,90)),
  posters: [...document.querySelectorAll('.model-viewer__poster')].map(e => e.getAttribute('src')),
})), null, 2))
console.log(logs.join('\n'))
await page.screenshot({ path: 'qa-shots/webgl-hero.png' })
await browser.close()
