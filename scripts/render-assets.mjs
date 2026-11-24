import fs from 'node:fs'
import path from 'node:path'
import puppeteer from 'puppeteer-core'
import sharp from 'sharp'

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe'
const BASE = 'http://localhost:5173'
const OUT = path.resolve('public/images')
const RAW = path.resolve('qa-shots/renders')

fs.mkdirSync(OUT, { recursive: true })
fs.mkdirSync(RAW, { recursive: true })

const jobs = [
  { name: 'hero-car', render: 'car', view: 'hero', width: 1920, height: 1200 },
  { name: 'brand-detail', render: 'car', view: 'brand', width: 1600, height: 1200 },
  { name: 'car-stage', render: 'car', view: 'three-quarter', width: 1600, height: 1000 },
  { name: 'car-side', render: 'car', view: 'side', width: 1600, height: 1000 },
  { name: 'car-wheel', render: 'car', view: 'detail', width: 1600, height: 1000 },
  { name: 'car-rear', render: 'car', view: 'rear', width: 1600, height: 1000 },
  { name: 'car-cockpit', render: 'car', view: 'cockpit', width: 1600, height: 1000 },
  { name: 'bike-stage', render: 'bike', view: 'three-quarter', width: 1600, height: 1000 },
  { name: 'bike-front', render: 'bike', view: 'front', width: 1600, height: 1000 },
  { name: 'bike-side', render: 'bike', view: 'side', width: 1600, height: 1000 },
  { name: 'bike-rear', render: 'bike', view: 'rear', width: 1600, height: 1000 },
  { name: 'bike-engine', render: 'bike', view: 'engine', width: 1600, height: 1000 },
  { name: 'bike-cockpit', render: 'bike', view: 'tank', width: 1600, height: 1000 },
  { name: 'philosophy', render: 'bike', view: 'philosophy', width: 1600, height: 1200 },
  { name: 'finale', render: 'car', view: 'finale', width: 1920, height: 1080 },
]

const only = process.argv[2]
const selected = only ? jobs.filter((job) => job.name.includes(only)) : jobs

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'new',
  args: [
    '--no-sandbox',
    '--enable-unsafe-swiftshader',
    '--use-angle=swiftshader',
    '--hide-scrollbars',
    '--force-color-profile=srgb',
  ],
})

const page = await browser.newPage()
page.on('pageerror', (error) => console.log('PAGEERROR', error.message))
page.on('console', (message) => {
  if (message.type() === 'error') console.log('CONSOLE', message.text())
})

for (const job of selected) {
  const url = `${BASE}/?render=${job.render}&view=${job.view}`
  await page.setViewport({ width: job.width, height: job.height, deviceScaleFactor: 1 })
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 120000 })
  try {
    await page.waitForFunction(
      () => document.documentElement.dataset.renderReady === 'true',
      { timeout: 90000 },
    )
  } catch {
    console.log('TIMEOUT waiting for model', job.name)
  }
  await new Promise((resolve) => setTimeout(resolve, 2600))
  const file = path.join(RAW, `${job.name}.png`)
  await page.screenshot({ path: file })
  await sharp(file)
    .webp({ quality: 88, effort: 6 })
    .toFile(path.join(OUT, `${job.name}.webp`))
  const stats = fs.statSync(path.join(OUT, `${job.name}.webp`))
  console.log('captured', job.name, Math.round(stats.size / 1024) + 'kb')
}

await browser.close()

// hero: avif + social crop
if (fs.existsSync(path.join(RAW, 'hero-car.png'))) {
  await sharp(path.join(RAW, 'hero-car.png'))
    .avif({ quality: 55, effort: 6 })
    .toFile(path.join(OUT, 'hero-car.avif'))

  await sharp(path.join(RAW, 'hero-car.png'))
    .resize(1200, 630, { fit: 'cover', position: 'right' })
    .jpeg({ quality: 86, mozjpeg: true })
    .toFile(path.join(OUT, 'og.jpg'))
}

console.log('done')
