// Test matrix operations
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

  // All inputs in matrix page
  const inputs = page.locator('input')
  const count = await inputs.count()
  results.push({ test: 'total inputs', count })

  // Fill first 4 inputs (matrix A 2x2 = 4 inputs)
  // Need to find which inputs belong to A
  // Let's just fill in order 1, 2, 3, 4 for A and 5, 6, 7, 8 for B
  // Then click 加
  for (let i = 0; i < 4; i++) {
    await inputs.nth(i).fill(String(i + 1))
    await page.waitForTimeout(50)
  }
  // Fill B (inputs 9-12)
  for (let i = 8; i < 12; i++) {
    await inputs.nth(i).fill(String(i - 7))
    await page.waitForTimeout(50)
  }

  // Click A+B button
  await page.locator('button:has-text("A+B")').click()
  await page.waitForTimeout(500)

  let body = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'matrix A+B with [[1,2],[3,4]] + [[1,2],[3,4]]', body: body.slice(0, 1500) })

  // Click transpose on A
  await page.locator('button:has-text("Aᵀ")').click()
  await page.waitForTimeout(500)
  let transposeBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'transpose A', body: transposeBody.slice(0, 1500) })

  // determinant on A
  await page.locator('button:has-text("|A|")').click()
  await page.waitForTimeout(500)
  let detBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'det A (should be -2)', body: detBody.slice(0, 1500) })

  // inverse on A
  await page.locator('button:has-text("A⁻¹")').click()
  await page.waitForTimeout(500)
  let invBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'inv A', body: invBody.slice(0, 1500) })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
