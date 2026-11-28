import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 })
const logs = []
page.on('console', m => logs.push(`${m.type()}: ${m.text().slice(0,300)}`))
page.on('pageerror', e => logs.push('PAGEERROR ' + e.message))
page.on('requestfailed', r => logs.push('REQFAIL ' + r.url() + ' ' + r.failure()?.errorText))
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1500))
await page.evaluate(() => {
  const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
  b?.click()
})
await new Promise(r => setTimeout(r, 20000))
console.log(JSON.stringify(await page.evaluate(() => {
  const mv = document.querySelector('.hero__viewer .model-viewer')
  return {
    exists: !!mv,
    loaded: mv?.dataset.loaded,
    canvases: document.querySelectorAll('.hero__viewer canvas').length,
    fallback: mv?.querySelector('.model-viewer--fallback')?.textContent.trim().slice(0,120),
    still: mv?.classList.contains('model-viewer--still'),
    poster: mv?.querySelector('.model-viewer__poster')?.getAttribute('src'),
    loader: mv?.querySelector('.model-viewer__loader')?.textContent.trim(),
    html: mv?.outerHTML.slice(0,400),
  }
}), null, 2))
console.log(logs.join('\n'))
await page.screenshot({ path: 'qa-shots/hero-diag.png' })
await browser.close()
