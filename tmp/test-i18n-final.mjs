// Check EN mode more carefully
import { chromium } from 'file:///C:/Users/白东鑫/AppData/Local/Temp/node_modules/playwright/index.mjs'

const URL = 'http://localhost:4180/'
const CHROME = 'C:/Users/白东鑫/AppData/Local/ms-playwright/chromium-1223/chrome-win64/chrome.exe'

async function run() {
  const browser = await chromium.launch({ headless: true, executablePath: CHROME })
  const ctx = await browser.newContext()
  const page = await ctx.newPage()

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 20000 })
  await page.waitForTimeout(500)

  const results = []

  // Click the lang select
  const langSelect = page.locator('header select').first()
  await langSelect.selectOption('en')
  await page.waitForTimeout(1000)

  // Get i18n language attribute on html
  const lang = await page.evaluate(() => document.documentElement.lang)
  results.push({ test: 'html lang after en switch', lang })

  // Get full body text and look for any english
  const body = await page.evaluate(() => document.body.innerText)
  const hasEnglish = /Scientific|Calculator|History|Result|Formula|Variable|Pi|Sin|Matrix/i.test(body)
  results.push({ test: 'has English?', hasEnglish, body: body.slice(0, 1000) })

  // Check the settingsStore content via localStorage
  const ls = await page.evaluate(() => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      data[k] = localStorage.getItem(k)
    }
    return data
  })
  results.push({ test: 'localStorage', ls: JSON.stringify(ls).slice(0, 500) })

  console.log(JSON.stringify(results, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
