import React from 'react'
import { $, expect } from '@wdio/globals'
import { mock, fn } from '@wdio/browser-runner'
import { render } from '@testing-library/react'
import browser from 'webextension-polyfill'

import Component from './component.js'

mock('webextension-polyfill', () => ({
  runtime: {
    sendMessage: fn().mockResolvedValue({ data: 'Some funny cat fact!' })
  }
}))

describe('Web Extension Component', () => {
  it('should be able to fetch cat facts', async () => {
    render(<Component />)
    await expect($('h1')).toHaveText('Cat Facts!')

    const getCatFactBtn = await $('aria/Get a Cat Fact!')
    await getCatFactBtn.click()

    await getCatFactBtn.waitForEnabled()
    await expect($('p')).toHaveText('Some funny cat fact!') // WebdriverIO matcher (async)
    expect(browser.runtime.sendMessage).toHaveBeenCalledWith({ action: 'fetch' }) // Jest matcher (sync)
  })
})
