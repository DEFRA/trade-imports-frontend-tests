import { Page } from './page.js'
import { $ } from '@wdio/globals'

class CookiesPage extends Page {
  get titleText() {
    return $('h1[class="govuk-heading-l"]')
  }

  async getTitle() {
    return await this.getTextFrom(this.titleText)
  }
}

export default new CookiesPage()
