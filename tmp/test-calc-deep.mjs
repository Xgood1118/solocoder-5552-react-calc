// More tests: matrix, units, modes
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

  async function evalExpr(expr) {
    const input = page.locator('input[type="text"]').first()
    await input.click()
    await input.press('Control+a')
    await input.press('Delete')
    await page.waitForTimeout(50)
    await input.fill(expr)
    await page.waitForTimeout(100)
    await input.press('Enter')
    await page.waitForTimeout(300)
    return await page.evaluate(() => document.body.innerText)
  }

  // P(5,2) = 20
  let body = await evalExpr('P(5,2)')
  results.push({ test: 'P(5,2) should be 20', body: body.slice(0, 300) })

  // C is single-letter — try other ways
  body = await evalExpr('comb(5,2)')
  results.push({ test: 'comb(5,2)', body: body.slice(0, 300) })

  // 0.625 in binary
  body = await evalExpr('0.625')
  results.push({ test: '0.625', body: body.slice(0, 300) })

  // matrix page
  await page.goto(URL + 'matrix', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  let matrixBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'matrix page first load', body: matrixBody.slice(0, 600) })

  // converter page
  await page.goto(URL + 'converter', { waitUntil: 'networkidle' })
  await page.waitForTimeout(500)
  let converterBody = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'converter page first load', body: converterBody.slice(0, 600) })

  // Big integer precision: 100! - already showed it
  // floor/ceil
  await page.goto(URL, { waitUntil: 'networkidle' })
  await page.waitForTimeout(300)

  body = await evalExpr('floor(3.7)')
  results.push({ test: 'floor(3.7) should be 3', body: body.slice(0, 300) })

  body = await evalExpr('ceil(3.2)')
  results.push({ test: 'ceil(3.2) should be 4', body: body.slice(0, 300) })

  body = await evalExpr('round(3.5)')
  results.push({ test: 'round(3.5)', body: body.slice(0, 300) })

  body = await evalExpr('abs(-5.5)')
  results.push({ test: 'abs(-5.5)', body: body.slice(0, 300) })

  body = await evalExpr('sin(pi/2)')  // angle mode is RAD
  results.push({ test: 'sin(pi/2) should be 1', body: body.slice(0, 300) })

  body = await evalExpr('log(100)')  // common log base 10
  results.push({ test: 'log(100) should be 2', body: body.slice(0, 300) })

  body = await evalExpr('ln(e)')
  results.push({ test: 'ln(e) should be 1', body: body.slice(0, 300) })

  body = await evalExpr('1+i*1')  // pure imaginary
  results.push({ test: '1+i*1 should be 1+i', body: body.slice(0, 300) })

  // Try i alone
  body = await evalExpr('i*i')
  results.push({ test: 'i*i should be -1', body: body.slice(0, 300) })

  // Check the = sign displays or just hides history
  // Try history click to reload
  body = await evalExpr('7+3')
  results.push({ test: '7+3 should be 10', body: body.slice(0, 300) })

  // Bug: factorial small number
  body = await evalExpr('3!+2!')  // 6+2=8
  results.push({ test: '3!+2! should be 8', body: body.slice(0, 300) })

  // Test angle mode toggle — click DEG button
  body = await evalExpr('sin(30)')  // RAD mode = sin(30 rad)
  results.push({ test: 'sin(30) in RAD mode (should be tiny)', body: body.slice(0, 300) })

  // sqrt negative number
  body = await evalExpr('sqrt(-1)')
  results.push({ test: 'sqrt(-1) should be i', body: body.slice(0, 300) })

  // Empty expression
  body = await evalExpr('')
  results.push({ test: 'empty expression', body: body.slice(0, 300) })

  // bad expression
  body = await evalExpr('abc+def')
  results.push({ test: 'abc+def unknown', body: body.slice(0, 300) })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
