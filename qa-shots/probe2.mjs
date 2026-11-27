import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new', args: ['--disable-3d-apis','--disable-webgl','--disable-webgl2','--no-sandbox'] })
const page = await browser.newPage()
await page.setViewport({ width: 390, height: 844 })
await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
await new Promise(r => setTimeout(r, 1200))
await page.evaluate(() => { const el = document.querySelector('#automobile'); window.scrollTo(0, el.getBoundingClientRect().top + scrollY) })
await new Promise(r => setTimeout(r, 1500))
console.log(JSON.stringify(await page.evaluate(() => {
  const info = (el) => { const r = el.getBoundingClientRect(); return { cls: el.className, y: Math.round(r.y), h: Math.round(r.height), op: getComputedStyle(el).opacity, z: getComputedStyle(el).zIndex } }
  return {
    scrollY: Math.round(scrollY),
    stickies: [...document.querySelectorAll('.stage__sticky')].map(info),
    fallbacks: [...document.querySelectorAll('.stage .model-viewer--fallback')].map(info),
    inners: [...document.querySelectorAll('.stage .model-viewer__fallback-inner')].map(info),
    atCenter: document.elementFromPoint(195, 422)?.className,
  }
}), null, 2))
await page.screenshot({ path: 'qa-shots/probe-stage.png' })
await browser.close()
