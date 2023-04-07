import type { Options } from '@wdio/types'

import { config as baseConfig } from './wdio.conf.js'

export const config: Options.Testrunner = {
  ...baseConfig,
  specs: [
    './src/**/*.test.ts',
    './content-script/**/*.test.ts',
  ],
  runner: ['browser', {
    preset: 'lit',
    headless: !process.env.DEBUG
  }],
  capabilities: [{
    browserName: 'chrome',
  }, {
    browserName: 'firefox',
  }]
}
