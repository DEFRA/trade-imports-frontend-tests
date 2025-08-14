import { Page } from './page.js'
import { $ } from '@wdio/globals'

class FooterPage extends Page {
  get cookiesLink() {
    return $('=Cookies')
  }

  get accessibilityLink() {
    return $('=Accessibility statement')
  }

  get allLinkText() {
    return $('ul[class="govuk-footer__inline-list"]')
  }

  async clickCookies() {
    return await this.clickLink(this.cookiesLink)
  }

  async clickAccessibility() {
    return await this.clickLink(this.accessibilityLink)
  }

  async getAllLinkText() {
    return await this.getTextFrom(this.allLinkText)
  }
}

export default new FooterPage()
