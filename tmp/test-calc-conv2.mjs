// Test unit converter more carefully
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

  // The unit converter page has 2 inputs (left + right) within main
  // Find inputs within main element
  const mainInputs = page.locator('main input')
  const count = await mainInputs.count()
  results.push({ test: 'main inputs count', count })

  // Get default values
  let leftDefault = await mainInputs.first().inputValue()
  let rightDefault = await mainInputs.last().inputValue()
  results.push({ test: 'defaults', left: leftDefault, right: rightDefault })

  // Type 100 into left
  await mainInputs.first().fill('100')
  await page.waitForTimeout(500)
  leftDefault = await mainInputs.first().inputValue()
  rightDefault = await mainInputs.last().inputValue()
  results.push({ test: 'after 100 in left', left: leftDefault, right: rightDefault })

  // Switch to temp tab
  await page.locator('button:has-text("温度")').click()
  await page.waitForTimeout(500)
  // Fill left with 100, switch from C to F
  await mainInputs.first().fill('100')
  await page.waitForTimeout(500)
  const tempRight = await mainInputs.last().inputValue()
  results.push({ test: '100C default', left: await mainInputs.first().inputValue(), right: tempRight })

  // Switch the left select to °F and right to K
  const mainSelects = page.locator('main select')
  const selectCount = await mainSelects.count()
  results.push({ test: 'selects count', selectCount })

  await mainSelects.first().selectOption('°F')
  await page.waitForTimeout(500)
  results.push({ test: '100F in °F select', left: await mainInputs.first().inputValue(), right: await mainInputs.last().inputValue() })

  // Test base conversion: 0.625 in DEC input (3rd input)
  await page.locator('button:has-text("进制互转")').click()
  await page.waitForTimeout(500)

  // Find DEC input - it's the 3rd input (BIN=0, OCT=1, DEC=2, HEX=3)
  const baseInputs = page.locator('main input')
  const baseCount = await baseInputs.count()
  results.push({ test: 'base inputs count', baseCount })

  // DEC input
  await baseInputs.nth(2).fill('0.625')
  await page.waitForTimeout(500)
  const binVal = await baseInputs.nth(0).inputValue()
  const octVal = await baseInputs.nth(1).inputValue()
  const decVal = await baseInputs.nth(2).inputValue()
  const hexVal = await baseInputs.nth(3).inputValue()
  results.push({ test: '0.625 in DEC', bin: binVal, oct: octVal, dec: decVal, hex: hexVal })

  // Test 0.1 in BIN (should give 0.5 in DEC)
  await baseInputs.nth(0).fill('0.1')
  await page.waitForTimeout(500)
  results.push({ test: '0.1 in BIN', bin: await baseInputs.nth(0).inputValue(), oct: await baseInputs.nth(1).inputValue(), dec: await baseInputs.nth(2).inputValue(), hex: await baseInputs.nth(3).inputValue() })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
