// Investigate temperature conversion issue
import { chromium } from 'file:///C:/Users/白东鑫/AppData/Local/Temp/node_modules/playwright/index.mjs'

const URL = 'http://localhost:4180/'
const CHROME = 'C:/Users/白东鑫/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME })
  const ctx = await browser.newContext()
  const page = await ctx.newPage()

  const consoleErrors = []
  page.on('pageerror', err => consoleErrors.push('PAGE_ERROR: ' + err.message))

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 20000 })
  await page.waitForTimeout(500)

  await page.locator('nav a:has-text("换算")').first().click()
  await page.waitForTimeout(800)

  const results = []

  // Switch to temperature tab
  await page.locator('button:has-text("温度")').click()
  await page.waitForTimeout(500)

  const mainInputs = page.locator('main input')
  const mainSelects = page.locator('main select')

  results.push({
    test: 'after temp tab click — BEFORE fill',
    left: await mainInputs.first().inputValue(),
    right: await mainInputs.last().inputValue(),
    leftSelect: await mainSelects.first().inputValue(),
    rightSelect: await mainSelects.last().inputValue(),
  })

  // Clear and type 100
  await mainInputs.first().click()
  await mainInputs.first().press('Control+a')
  await mainInputs.first().press('Delete')
  await page.waitForTimeout(100)
  await mainInputs.first().type('100')
  await page.waitForTimeout(500)
  results.push({
    test: 'after typing 100 in temperature',
    left: await mainInputs.first().inputValue(),
    right: await mainInputs.last().inputValue(),
    leftSelect: await mainSelects.first().inputValue(),
    rightSelect: await mainSelects.last().inputValue(),
  })

  // Switch the right select to °F
  await mainSelects.last().selectOption('°F')
  await page.waitForTimeout(500)
  results.push({
    test: 'after rightSelect → °F',
    left: await mainInputs.first().inputValue(),
    right: await mainInputs.last().inputValue(),
    leftSelect: await mainSelects.first().inputValue(),
    rightSelect: await mainSelects.last().inputValue(),
  })

  // Switch left to °F and right to °C (should be: 100 °F = 37.78 °C)
  await mainSelects.first().selectOption('°F')
  await mainSelects.last().selectOption('°C')
  await page.waitForTimeout(500)
  results.push({
    test: '100 °F → °C',
    left: await mainInputs.first().inputValue(),
    right: await mainInputs.last().inputValue(),
    leftSelect: await mainSelects.first().inputValue(),
    rightSelect: await mainSelects.last().inputValue(),
  })

  // Test data storage KB (note: prompt says 二进制 KB/MB/GB vs 十进制 KB/MB/GB — but only 十进制 supported as KB)
  await page.locator('button:has-text("数据存储")').click()
  await page.waitForTimeout(500)
  results.push({
    test: 'data storage tab loaded',
    leftSelect: await mainSelects.first().inputValue(),
    rightSelect: await mainSelects.last().inputValue(),
  })

  // 1 KB → bytes (should be 1000)
  await mainInputs.first().fill('1')
  await page.waitForTimeout(500)
  results.push({
    test: '1 KB → ?',
    left: await mainInputs.first().inputValue(),
    right: await mainInputs.last().inputValue(),
  })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
