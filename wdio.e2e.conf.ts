import path from 'node:path'
import url from 'node:url'
import fs from 'node:fs/promises'

import type { Options } from '@wdio/types'

import pkg from './package.json' assert { type: 'json' }
import { config as baseConfig } from './wdio.conf.js'


const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
const chromeExtension = (await fs.readFile(path.join(__dirname, `web-extension-chrome-v${pkg.version}.crx`))).toString('base64')

export const config: Options.Testrunner = {
  ...baseConfig,
  specs: ['./e2e/**/*.e2e.ts'],
  capabilities: [{
    browserName: 'chrome',
    'goog:chromeOptions': {
      args: ['--headless=new'],
      extensions: [chromeExtension]
    }
  }, {
    browserName: 'firefox',
    'moz:firefoxOptions': {
      args: ['-headless']
    }
  }]
}
