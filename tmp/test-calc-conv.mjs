// Test converter: temperature, units, base conversion
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

  await page.locator('nav a:has-text("换算")').first().click()
  await page.waitForTimeout(800)

  const results = []

  // All inputs and selects
  let allInputs = await page.locator('input').count()
  let allSelects = await page.locator('select').count()
  results.push({ test: 'initial converter', inputs: allInputs, selects: allSelects })

  // Find the value input — first input is value, then select for from-unit and to-unit
  const inputs = page.locator('input')
  await inputs.first().fill('100')
  await page.waitForTimeout(300)
  let body = await page.evaluate(() => document.body.innerText)
  results.push({ test: '100 米 input', body: body.slice(0, 1500) })

  // Change from-unit to "英尺 (ft)" via select — skip the first 2 layout selects
  const selects = page.locator('main select')
  await selects.first().selectOption('ft')
  await page.waitForTimeout(300)
  body = await page.evaluate(() => document.body.innerText)
  results.push({ test: '100 米 → 英尺', body: body.slice(0, 1500) })

  // Temperature: switch category
  await page.locator('button:has-text("温度")').click()
  await page.waitForTimeout(500)
  body = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'temperature tab', body: body.slice(0, 1500) })

  // 100 摄氏度 → 华氏度
  const mainSelects = page.locator('main select')
  await inputs.first().fill('100')
  await mainSelects.first().selectOption('°C')
  await mainSelects.last().selectOption('°F')
  await page.waitForTimeout(300)
  body = await page.evaluate(() => document.body.innerText)
  results.push({ test: '100 °C → °F (should be 212)', body: body.slice(0, 1500) })

  // Test 进制互转 — click 进制互转 tab
  await page.locator('button:has-text("进制互转")').click()
  await page.waitForTimeout(500)
  body = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'base conversion tab', body: body.slice(0, 1500) })

  // 0.625 decimal to binary
  const allBaseInputs = await page.locator('input').count()
  results.push({ test: 'base inputs', count: allBaseInputs })

  // Type 0.625 in DEC input
  await inputs.first().fill('0.625')
  await page.waitForTimeout(500)
  body = await page.evaluate(() => document.body.innerText)
  results.push({ test: '0.625 DEC → BIN', body: body.slice(0, 2000) })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
