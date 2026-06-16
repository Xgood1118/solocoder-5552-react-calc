// Test matrix + converter pages in detail
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

  // Click "矩阵" link
  await page.locator('a:has-text("矩阵")').first().click()
  await page.waitForTimeout(800)
  let matrixUrl = page.url()
  let matrixBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'clicked matrix', url: matrixUrl, body: matrixBody.slice(0, 800) })

  // Click "换算"
  await page.locator('a:has-text("换算")').first().click()
  await page.waitForTimeout(800)
  let converterUrl = page.url()
  let converterBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'clicked converter', url: converterUrl, body: converterBody.slice(0, 800) })

  // Back to home
  await page.locator('a:has-text("基础")').first().click()
  await page.waitForTimeout(500)
  results.push({ test: 'back to home', url: page.url() })

  // Test preset (formula favorites)
  await page.locator('button:has-text("公式收藏")').click()
  await page.waitForTimeout(300)
  let presetBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'preset tab', body: presetBody.slice(0, 600) })

  // Test variables
  await page.locator('button:has-text("变量")').click()
  await page.waitForTimeout(300)
  let varBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'variable tab', body: varBody.slice(0, 600) })

  // theme switch — color button with title="Dark"
  await page.locator('button[title="Dark"]').click()
  await page.waitForTimeout(300)
  let darkBody = await page.evaluate(() => document.documentElement.className)
  results.push({ test: 'dark theme class', htmlClass: darkBody })

  // lang switch
  await page.locator('button:has-text("EN")').click()
  await page.waitForTimeout(500)
  let enBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'lang switch EN', body: enBody.slice(0, 400) })

  // back to ZH
  await page.locator('button:has-text("中文")').click()
  await page.waitForTimeout(300)

  // mode switch: 复数
  await page.locator('button:has-text("复数")').first().click()
  await page.waitForTimeout(500)
  let complexBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'switch to complex mode', body: complexBody.slice(0, 500) })

  // Test base conversion (binary)
  await page.goto(URL + 'converter', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  let convBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'converter page', body: convBody.slice(0, 800) })

  // Try to type 0.625 in some input
  const allInputs = await page.locator('input').count()
  results.push({ test: 'converter input count', count: allInputs })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
