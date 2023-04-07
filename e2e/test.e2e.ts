import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs/promises'

import { browser, $$, expect } from '@wdio/globals'

import pkg from '../package.json' assert { type: 'json' }

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const isFirefox = browser.capabilities.browserName === 'firefox'

describe('Web Extension e2e test', () => {
  before(async () => {
    if (!isFirefox) {
      return
    }

    const extension = await fs.readFile(path.resolve(__dirname, '..', `web-extension-firefox-v${pkg.version}.xpi`))
    await browser.installAddOn(extension.toString('base64'), true)
  })

  it('should load with working extension', async () => {
    await browser.url('https://google.com')
    const selector = isFirefox
      ? '.web-component-button'
      : 'web-component-button'
    await expect($$(selector)).toBeElementsArrayOfSize(4)
  })
})
