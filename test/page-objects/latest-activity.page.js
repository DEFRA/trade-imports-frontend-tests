import { Page } from './page.js'
import { $ } from '@wdio/globals'

class LatestActivityPage extends Page {
  open() {
    return super.open('/latest-activity')
  }

  get btmsHeader() {
    return $('h2.govuk-heading-m=BTMS')
  }

  get cdsHeader() {
    return $('h2.govuk-heading-m=CDS')
  }

  get ipaffsHeader() {
    return $('h2.govuk-heading-m=IPAFFS')
  }

  get decisionRow() {
    return $(
      '//table[@aria-label="Latest activity for BTMS"]//td[text()="Decision"]'
    )
  }

  get clearanceRequestRow() {
    return $(
      '//table[@aria-label="Latest activity for CDS"]//td[text()="Clearance request"]'
    )
  }

  get finalisationRow() {
    return $(
      '//table[@aria-label="Latest activity for CDS"]//td[text()="Finalisation"]'
    )
  }

  get notificationRow() {
    return $(
      '//table[@aria-label="Latest activity for IPAFFS"]//td[text()="Notification"]'
    )
  }

  get btmsDecisionDate() {
    return $(
      '//table[@aria-label="Latest activity for BTMS"]//td[text()="Decision"]/following-sibling::td[1]'
    )
  }

  get cdsClearanceRequestDate() {
    return $(
      '//table[@aria-label="Latest activity for CDS"]//td[text()="Clearance request"]/following-sibling::td[1]'
    )
  }

  get cdsFinalisationDate() {
    return $(
      '//table[@aria-label="Latest activity for CDS"]//td[text()="Finalisation"]/following-sibling::td[1]'
    )
  }

  get ipaffsNotificationDate() {
    return $(
      '//table[@aria-label="Latest activity for IPAFFS"]//td[text()="Notification"]/following-sibling::td[1]'
    )
  }

  async isBtmsHeaderVisible() {
    return await this.btmsHeader.isDisplayed()
  }

  async isCdsHeaderVisible() {
    return await this.cdsHeader.isDisplayed()
  }

  async isIpaffsHeaderVisible() {
    return await this.ipaffsHeader.isDisplayed()
  }

  async isDecisionVisible() {
    return await this.decisionRow.isDisplayed()
  }

  async isClearanceRequestVisible() {
    return await this.clearanceRequestRow.isDisplayed()
  }

  async isFinalisationVisible() {
    return await this.finalisationRow.isDisplayed()
  }

  async isNotificationVisible() {
    return await this.notificationRow.isDisplayed()
  }

  async isValidDate(element) {
    const dateText = await element.getText()
    return !isNaN(Date.parse(dateText))
  }

  async areAllDatesValid() {
    const results = await Promise.all([
      this.isValidDate(this.btmsDecisionDate),
      this.isValidDate(this.cdsClearanceRequestDate),
      this.isValidDate(this.cdsFinalisationDate),
      this.isValidDate(this.ipaffsNotificationDate)
    ])
    return results.every(Boolean)
  }
}

export default new LatestActivityPage()
