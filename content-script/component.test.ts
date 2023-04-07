import { html, render } from 'lit'
import { $, expect } from '@wdio/globals'

import { WebExtensionButton } from './component.js'

describe('Web Extension Component', () => {
  it('should render correctly @ff-only', async () => {
    const elem = WebExtensionButton.render()
    document.body.appendChild(elem)
    await expect($('.web-extension-component').$('a')).toBePresent()
    await expect($('.web-extension-component').$('a')).toHaveAttribute(
      'href',
      'https://runme.dev'
    )
  })

  it('should render correctly @chrome-only', async () => {
    render(
      html`<web-extension-button />`,
      document.body
    )
    await expect($('web-extension-button').shadow$('a')).toBePresent()
    await expect($('web-extension-button').shadow$('a')).toHaveAttribute(
      'href',
      'https://runme.dev'
    )
  })
})
