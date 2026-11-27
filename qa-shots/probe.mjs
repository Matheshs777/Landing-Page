import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--disable-3d-apis','--disable-webgl','--disable-webgl2','--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1200))
await page.evaluate(() => window.scrollTo(0, document.querySelector('#automobile').getBoundingClientRect().top + scrollY))
await new Promise(r => setTimeout(r, 1200))
console.log(JSON.stringify(await page.evaluate(() => {
  const stage = document.querySelector('.stage__sticky')
  const canvas = stage?.querySelector('.stage__canvas')
  const fb = canvas?.querySelector('.model-viewer--fallback')
  const r = fb?.getBoundingClientRect()
  return {
    stageLoaded: stage?.dataset.loaded,
    canvasOpacity: canvas ? getComputedStyle(canvas).opacity : null,
    fallback: fb ? { rect: [r.x, r.y, r.width, r.height], display: getComputedStyle(fb).display, opacity: getComputedStyle(fb).opacity, color: getComputedStyle(fb).color } : null,
    fallbacks: document.querySelectorAll('.stage .model-viewer--fallback').length,
    viewers: document.querySelectorAll('.stage .model-viewer').length,
  }
}), null, 2))
await browser.close()
