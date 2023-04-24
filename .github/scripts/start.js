#!/usr/bin/env node

import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs/promises'

import getPort from 'get-port'
import waitOn from 'wait-on'
import { remote } from 'webdriverio'

import pkg from '../../package.json' assert { type: 'json' }

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))

/**
 * start browser driver
 */
async function startDriver (port, browserName) {
  const driverName = browserName === 'chrome'
    ? 'chromedriver'
    : 'geckodriver'
  const hostName = browserName === 'chrome'
    ? 'localhost'
    : '0.0.0.0'
  const driver = await import(driverName)
  const p = driver.start([`--port=${port}`])
  console.log(`Start ${driverName} on port ${port}`)
  return Promise.race([
    waitOn({ resources: [`http-get://${hostName}:${port}/status`] }),
    new Promise((resolve, reject) => p.on('exit', () => reject(new Error(`Failed to start driver`))))
  ])
}

/**
 * start WebDriver session with extension installed
 */
async function startBrowser (port, browserName) {
  const capabilities = browserName === 'chrome'
    ? {
      browserName,
      'goog:chromeOptions': {
        args: [`--load-extension=${path.join(__dirname, '..', '..', 'dist')}`]
      }
    }
    : { browserName }
  const browser = await remote({
    port,
    logLevel: 'error',
    automationProtocol: 'webdriver',
    capabilities
  })

  if (browserName === 'firefox') {
    const extension = await fs.readFile(path.join(__dirname, '..', '..', `web-extension-firefox-v${pkg.version}.xpi`))
    await browser.installAddOn(extension.toString('base64'), true)
  }

  await browser.url('https://github.com/stateful/web-extension-starter-kit')
}

const browserName = process.argv.slice(2).pop() || 'chrome'
console.log(`Run web extension in ${browserName}...`)
const port = await getPort()
await startDriver(port, browserName)
await startBrowser(port, browserName)
