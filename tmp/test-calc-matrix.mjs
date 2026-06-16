// Test matrix editor in detail — check whether input fields exist
import { chromium } from 'file:///C:/Users/白东鑫/AppData/Local/Temp/node_modules/playwright/index.mjs'

const URL = 'http://localhost:4180/'
const CHROME = 'C:/Users/白东鑫/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME })
  const ctx = await browser.newContext()
  const page = await ctx.newPage()

  const consoleErrors = []
  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text())
  })
  page.on('pageerror', err => consoleErrors.push('PAGE_ERROR: ' + err.message))

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 20000 })
  await page.waitForTimeout(500)

  await page.locator('nav a:has-text("矩阵")').first().click()
  await page.waitForTimeout(800)

  const results = []

  // Get all elements in the matrix editor area
  const allInputs = await page.locator('input').count()
  const allButtons = await page.locator('button').count()
  results.push({ test: 'matrix input count', inputCount: allInputs, buttonCount: allButtons })

  // Get the actual HTML for the matrix editor area
  const matrixHTML = await page.evaluate(() => {
    // find the input/table area
    const main = document.querySelector('main')
    return main ? main.innerHTML.slice(0, 3000) : 'no main'
  })
  results.push({ test: 'matrix HTML sample', html: matrixHTML })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
