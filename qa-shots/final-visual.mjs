import puppeteer from 'puppeteer-core'

const browser = await puppeteer.launch({
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--enable-unsafe-swiftshader','--use-gl=angle','--use-angle=swiftshader','--no-sandbox','--disable-dev-shm-usage'],
})

async function run(width, height, tag) {
  const page = await browser.newPage()
  await page.setViewport({ width, height, deviceScaleFactor: 1 })
  const errors = []
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text().slice(0,200)) })
  page.on('pageerror', e => errors.push('PAGEERROR ' + e.message))
  await page.goto('http://localhost:4173/', { waitUntil: 'domcontentloaded' })
  await new Promise(r => setTimeout(r, 1200))
  await page.evaluate(() => {
    const b = [...document.querySelectorAll('.consent button')].find(e => e.textContent.trim().toLowerCase().startsWith('essential'))
    b?.click()
  })
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `qa-shots/final-${tag}-hero.png` })

  await page.evaluate(() => document.querySelector('#gallery').scrollIntoView({ block: 'start' }))
  await page.waitForFunction(() => [...document.querySelectorAll('.gallery__item img')].every(img => img.complete && img.naturalWidth > 0), { timeout: 30000 }).catch(() => {})
  await new Promise(r => setTimeout(r, 800))
  await page.screenshot({ path: `qa-shots/final-${tag}-gallery.png` })

  await page.evaluate(() => document.querySelector('#configurator').scrollIntoView({ block: 'center' }))
  await new Promise(r => setTimeout(r, 6000))
  await page.screenshot({ path: `qa-shots/final-${tag}-config.png` })

  const metrics = await page.evaluate(() => {
    const sizes = {}
    for (const sel of ['.eyebrow', '.nav__link', '.btn', '.gallery__caption', '.footer__column a', '.view-chip__label', '.specs__row dt', '.model-viewer__still-note']) {
      const el = document.querySelector(sel)
      if (el) sizes[sel] = getComputedStyle(el).fontSize
    }
    return {
      sizes,
      overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      galleryImgs: [...document.querySelectorAll('.gallery__item img')].map(i => ({ src: i.getAttribute('src'), complete: i.complete, w: i.naturalWidth, h: i.naturalHeight })),
      canvases: document.querySelectorAll('canvas').length,
      fallbacks: [...document.querySelectorAll('.model-viewer--fallback')].length,
      stills: [...document.querySelectorAll('.model-viewer--still')].length,
      navHeight: document.querySelector('.nav__inner')?.getBoundingClientRect().height,
    }
  })
  console.log(tag, JSON.stringify(metrics, null, 2))
  console.log(tag, 'errors:', errors.length ? errors : 'none')
  await page.close()
}

await run(1440, 900, '1440')
await run(390, 844, '390')
await browser.close()
