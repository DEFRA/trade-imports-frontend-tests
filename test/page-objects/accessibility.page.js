import { Page } from './page.js'
import { $ } from '@wdio/globals'

class AccessibilityPage extends Page {
  get titleText() {
    return $('h1[class="govuk-heading-l"]')
  }

  async getTitle() {
    return await this.getTextFrom(this.titleText)
  }
}

export default new AccessibilityPage()
