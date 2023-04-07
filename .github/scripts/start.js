#!/usr/bin/env node

import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs/promises'

import { remote } from 'webdriverio'

import pkg from '../../package.json' assert { type: 'json' }

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/**
 * start browser driver
 */
async function startDriver (browserName) {
  const driverName = browserName === 'chrome'
    ? 'chromedriver'
    : 'geckodriver'
  const driver = await import(driverName)
  driver.start(['--port=4444'])
  return new Promise((resolve) => setTimeout(resolve, 1000))
}

/**
 * start WebDriver session with extension installed
 */
async function startBrowser (browserName) {
  const extFileName = browserName === 'chrome'
    ? `web-extension-chrome-v${pkg.version}.crx`
    : `web-extension-firefox-v${pkg.version}.xpi`
  const extPath = path.join(__dirname, '..', '..', extFileName)

  await fs.access(extPath)
    .catch(() => console.log(`Can't access bundled extension at ${extPath}, did you run "npm run bundle" before?`))

  const capabilities = browserName === 'chrome'
    ? {
      browserName,
      'goog:chromeOptions': {
        extensions: [(await fs.readFile(extPath)).toString('base64')]
      }
    }
    : { browserName }
  const browser = await remote({
    logLevel: 'error',
    capabilities
  })

  if (browserName === 'firefox') {
    const extension = await fs.readFile(extFileName)
    await browser.installAddOn(extension.toString('base64'), true)
  }

  await browser.url('https://github.com/stateful/web-extension-starter-kit')
}

const browserName = process.argv.slice(2).pop() || 'chrome'
console.log(`Run web extension in ${browserName}...`);
await startDriver(browserName)
await startBrowser(browserName)
