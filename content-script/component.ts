import '@webcomponents/custom-elements'
import 'lit/polyfill-support.js'

import { LitElement, css, html, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type Variant = 'image' | 'text'

const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

@customElement('web-extension-button')
class LitBaseClass extends LitElement {
  @property({ type: String })
  variant: Variant = 'image'
}
class RawBaseClass {
  variant: Variant = 'image'
}
const BaseClass = isFirefox ? RawBaseClass : LitBaseClass

export class WebExtensionButton extends BaseClass {
  render() {
    return html`<a href="https://runme.dev">
      <img src="https://badgen.net/badge/Run%20this/Runme/5B3ADF?icon=https://runme.dev/img/logo.svg" />
    </a>`
  }

  static styles = css`
    a {
      margin: 5px 10px;
      display: inline-block;
    }
  `

  /**
   * helper method to render template strings into raw HTML
   */
  static getRenderString (data: TemplateResult) {
    const {strings, values} = data;
    const v: string[] = [...values, ''].map((e) => typeof e === 'object' ? WebExtensionButton.getRenderString(e as TemplateResult) : e) as string[]
    return strings.reduce((acc,s, i) => acc + s + v[i], '')
  }

  /**
   * render without using Web Components (needed for Firefox where this Web API is disabled)
   */
  static render (variant: Variant = 'image') {
    /**
     * Firefox doesn't support web components in content scripts
     * see https://github.com/w3c/webextensions/issues/210/
     */
    if (isFirefox) {
      const componentScope = 'web-extension-component'
      const elem = new WebExtensionButton()
      elem.variant = variant
      const wrapper = document.createElement('div')
      wrapper.className = componentScope
      wrapper.innerHTML = WebExtensionButton.getRenderString(elem.render())

      /**
       * attach CSS if needed
       */
      if (document.styleSheets.length) {
        WebExtensionButton.styles.cssText
          .split('}')
          .map((rule) => rule.trim())
          .filter(Boolean)
          .map((rule) => rule.includes('@media') ? rule : `.${componentScope} ${rule} }`)
          .forEach(
            (rule) => document.styleSheets.item(0)?.insertRule(rule, 1)
          )
      }

      return wrapper
    }

    const component = document.createElement('runme-button')
    component.setAttribute('variant', variant)
    return component
  }
}
