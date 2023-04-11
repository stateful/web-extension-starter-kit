import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs/promises'

import { browser, $$, $, expect } from '@wdio/globals'
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

  it('can get cat facts', async () => {
    const extensionRoot = await $('#extension-root')
    const getCatFactBtn = await extensionRoot.$('aria/Get a Cat Fact!')
    await getCatFactBtn.click()
    await expect(extensionRoot.$('p')).not.toHaveText('Click the button to fetch a fact!')
  })

  if (!isFirefox) {
    it('should get cat facts in popup window', async () => {
      await browser.openExtensionPopup('My Web Extension')

      const extensionRoot = await $('#extension-root')
      const getCatFactBtn = await extensionRoot.$('aria/Get a Cat Fact!')
      await getCatFactBtn.click()
      await expect(extensionRoot.$('p')).not.toHaveText('Click the button to fetch a fact!')
    })
  }
})
