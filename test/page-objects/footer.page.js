import { Page } from './page.js'
import { $ } from '@wdio/globals'

class FooterPage extends Page {
  get cookiesLink() {
    return $('=Cookies')
  }

  get accessibilityLink() {
    return $('=Accessibility statement')
  }

  async clickCookies() {
    return await this.clickLink(this.cookiesLink)
  }

  async clickAccessibility() {
    return await this.clickLink(this.accessibilityLink)
  }
}

export default new FooterPage()
