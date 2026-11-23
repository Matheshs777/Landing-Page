import puppeteer from 'puppeteer-core'
const browser = await puppeteer.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:'new',args:['--no-sandbox']})
const page = await browser.newPage()
await page.goto('http://localhost:5173',{waitUntil:'networkidle0'})
await page.evaluate(()=>document.fonts.ready)
const data = await page.evaluate(()=>{
  const c=document.createElement('canvas').getContext('2d')
  const measure=(text,size)=>{c.font=`700 ${size}px Sora`;return c.measureText(text).width}
  return {
    widths100: ['Hear everything.','Except the noise.'].map(t=>measure(t,100)),
    font: getComputedStyle(document.querySelector('.hero__title')).fontFamily,
    size: getComputedStyle(document.querySelector('.hero__title')).fontSize,
    copyWidth: document.querySelector('.hero__copy').getBoundingClientRect().width,
    titleWidth: document.querySelector('.hero__title').getBoundingClientRect().width
  }
})
console.log(JSON.stringify(data,null,2))
await browser.close()
