// Direct engine unit test (no playwright needed)
// We'll dynamically import compiled engine modules — but they use @ alias. Skip.

// Instead, run UI tests with playwright using fill+Enter
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
    // Select all + delete
    await input.press('Control+a')
    await input.press('Delete')
    await page.waitForTimeout(50)
    await input.fill(expr)
    await page.waitForTimeout(100)
    await input.press('Enter')
    await page.waitForTimeout(300)

    // Extract body text to see result
    const body = await page.evaluate(() => document.body.innerText)
    return body
  }

  // Helper: find a number-looking string in body
  function findResult(body, patterns) {
    for (const p of patterns) {
      const m = body.match(p)
      if (m) return m[1] || m[0]
    }
    return null
  }

  // Test 1: 1+1
  let body = await evalExpr('1+1')
  results.push({ test: '1+1', resultField: body.match(/结果[\s\S]*?([\d\.\-+i]+)/)?.[1] || 'N/A', body: body.slice(0, 400) })

  // Test 2: 5!
  body = await evalExpr('5!')
  results.push({ test: '5!', resultField: body.match(/=[\s\S]*?([\d\.\-+i]+)/)?.[1] || 'N/A', body: body.slice(0, 400) })

  // Test 3: 2+3i+(1-2i)
  body = await evalExpr('2+3i+(1-2i)')
  results.push({ test: '2+3i+(1-2i)', body: body.slice(0, 400) })

  // Test 4: 1/0 (div zero, should show 未定义)
  body = await evalExpr('1/0')
  results.push({ test: '1/0', body: body.slice(0, 400) })

  // Test 5: 7%-3 (mod negative)
  body = await evalExpr('7%-3')
  results.push({ test: '7%-3', body: body.slice(0, 400) })

  // Test 6: sqrt(-4)
  body = await evalExpr('sqrt(-4)')
  results.push({ test: 'sqrt(-4)', body: body.slice(0, 400) })

  // Test 7: C(5,2) = 10
  body = await evalExpr('C(5,2)')
  results.push({ test: 'C(5,2)', body: body.slice(0, 400) })

  // Test 8: pi * 2
  body = await evalExpr('pi*2')
  results.push({ test: 'pi*2', body: body.slice(0, 400) })

  // Test 9: 3.14159...  as pi*2 expected ~6.28
  body = await evalExpr('100!')
  results.push({ test: '100!', body: body.slice(0, 400) })

  // Test 10: 2^10
  body = await evalExpr('2^10')
  results.push({ test: '2^10', body: body.slice(0, 400) })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
