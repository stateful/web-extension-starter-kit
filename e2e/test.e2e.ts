import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs/promises'

import { browser, $$, expect } from '@wdio/globals'
import type { Capabilities } from '@wdio/types'

import pkg from '../package.json' assert { type: 'json' }

const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const isFirefox = (browser.capabilities as Capabilities.Capabilities).browserName === 'firefox'

describe('Web Extension e2e test', () => {
  before(async () => {
    if (!isFirefox) {
      return
    }

    const extension = await fs.readFile(path.resolve(__dirname, '..', `web-extension-firefox-v${pkg.version}.xpi`))
    // @ts-expect-error
    await browser.installAddOn(extension.toString('base64'), true)
  })

  it('should have injected the component from the content script', async () => {
    await browser.url('https://google.com')
    await expect($$('#extension-root')).toBeElementsArrayOfSize(1)
  })
})
