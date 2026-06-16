// Test matrix + converter pages using nav links (hash router)
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

  const results = []

  // Click 矩阵 nav link
  await page.locator('nav a:has-text("矩阵")').first().click()
  await page.waitForTimeout(800)
  let url1 = page.url()
  let body1 = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'clicked 矩阵', url: url1, bodyLen: body1.length, body: body1.slice(0, 1000) })

  // Click 换算
  await page.locator('nav a:has-text("换算")').first().click()
  await page.waitForTimeout(800)
  let url2 = page.url()
  let body2 = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'clicked 换算', url: url2, bodyLen: body2.length, body: body2.slice(0, 1000) })

  // Test base conversion input
  await page.locator('input[type="number"], input[type="text"]').first().fill('0.625')
  await page.waitForTimeout(500)
  let body2After = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'converter 0.625 input', body: body2After.slice(0, 1500) })

  // Click 进制
  await page.locator('button:has-text("进制"), button:has-text("二进制")').first().click().catch(() => {})
  await page.waitForTimeout(500)
  let baseBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'click 进制 button', body: baseBody.slice(0, 1500) })

  // Test 矩阵 page — fill in a 2x2 matrix and click add button
  await page.locator('nav a:has-text("矩阵")').first().click()
  await page.waitForTimeout(800)
  let matrixBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'matrix page text', body: matrixBody.slice(0, 1500) })

  // Try clicking 加 button
  const matrixInputs = await page.locator('input[type="number"]').count()
  results.push({ test: 'matrix input count', count: matrixInputs })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
