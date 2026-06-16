// Test i18n, theme, history reload
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

  // Switch to EN
  const langSelect = page.locator('header select').first()
  await langSelect.selectOption('en')
  await page.waitForTimeout(500)
  let body = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'EN mode', body: body.slice(0, 500) })

  // back to ZH
  await langSelect.selectOption('zh')
  await page.waitForTimeout(500)

  // Theme switch
  const themeSelect = page.locator('header select').nth(1)
  await themeSelect.selectOption('dark')
  await page.waitForTimeout(500)
  let dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
  results.push({ test: 'dark theme attr', dataTheme })

  await themeSelect.selectOption('retro')
  await page.waitForTimeout(500)
  dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
  results.push({ test: 'retro theme attr', dataTheme })

  await themeSelect.selectOption('bluewhite')
  await page.waitForTimeout(500)
  dataTheme = await page.evaluate(() => document.documentElement.getAttribute('data-theme'))
  results.push({ test: 'bluewhite theme attr', dataTheme })

  // Variable: assign a result to variable
  await themeSelect.selectOption('light')
  await page.waitForTimeout(300)

  // type 5+3, get 8, then click "assign to variable"
  const input = page.locator('input[type="text"]').first()
  await input.fill('5+3')
  await input.press('Enter')
  await page.waitForTimeout(300)

  // Click "变量" tab
  await page.locator('button:has-text("变量")').click()
  await page.waitForTimeout(500)
  body = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'variable tab after 5+3=8', body: body.slice(0, 800) })

  // Try to add a variable
  const addBtn = await page.locator('button:has-text("添加"), button:has-text("+"), button:has-text("新增")').count()
  results.push({ test: 'add var button count', count: addBtn })

  // Try preset
  await page.locator('button:has-text("公式收藏")').click()
  await page.waitForTimeout(300)
  body = await page.evaluate(() => document.body.innerText)
  results.push({ test: 'preset tab', body: body.slice(0, 800) })

  console.log(JSON.stringify({ results, consoleErrors }, null, 2))
  await browser.close()
}

run().catch(e => {
  console.error('FATAL:', e.message)
  process.exit(1)
})
