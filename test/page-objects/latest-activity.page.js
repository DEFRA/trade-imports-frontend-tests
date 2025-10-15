import { Page } from './page.js'
import { $ } from '@wdio/globals'

class LatestActivityPage extends Page {
  open() {
    return super.open('/latest-activity')
  }

  // --- Getters ---
  get btmsHeader() {
    return $('h2.govuk-heading-m=BTMS')
  }

  get cdsHeader() {
    return $('h2.govuk-heading-m=CDS')
  }

  get ipaffsHeader() {
    return $('h2.govuk-heading-m=IPAFFS')
  }

  // --- Actions ---
  async isBtmsHeaderVisible() {
    return await this.btmsHeader.isDisplayed()
  }

  async isCdsHeaderVisible() {
    return await this.cdsHeader.isDisplayed()
  }

  async isIpaffsHeaderVisible() {
    return await this.ipaffsHeader.isDisplayed()
  }
}

export default new LatestActivityPage()
