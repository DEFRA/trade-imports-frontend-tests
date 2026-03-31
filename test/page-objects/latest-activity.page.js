import { Page } from './page.js'
import { $ } from '@wdio/globals'

class LatestActivityPage extends Page {
  open() {
    return super.open('/latest-activity')
  }

  get navLatestActivityLink() {
    return $('a.govuk-service-navigation__link[href="/latest-activity"]')
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

  get decisionCreatedRow() {
    return $(
      '//table[@aria-label="Latest activity for BTMS"]//td[contains(normalize-space(.), "Decision created")]'
    )
  }

  get decisionSentRow() {
    return $(
      '//table[@aria-label="Latest activity for BTMS"]//td[contains(normalize-space(.), "Decision sent")]'
    )
  }

  get clearanceRequestRow() {
    return $(
      '//table[@aria-label="Latest activity for CDS"]//td[contains(normalize-space(.), "Clearance request")]'
    )
  }

  get finalisationRow() {
    return $(
      '//table[@aria-label="Latest activity for CDS"]//td[normalize-space(.)="Finalisation"]'
    )
  }

  get notificationRow() {
    return $(
      '//table[@aria-label="Latest activity for IPAFFS"]//td[normalize-space(.)="Notification"]'
    )
  }

  get btmsDecisionCreatedDate() {
    return $(
      '//table[@aria-label="Latest activity for BTMS"]//td[contains(normalize-space(.), "Decision created")]/following-sibling::td[1]'
    )
  }

  get btmsDecisionSentDate() {
    return $(
      '//table[@aria-label="Latest activity for BTMS"]//td[contains(normalize-space(.), "Decision sent")]/following-sibling::td[1]'
    )
  }

  get cdsClearanceRequestDate() {
    return $(
      '//table[@aria-label="Latest activity for CDS"]//td[normalize-space(.)="Clearance request"]/following-sibling::td[1]'
    )
  }

  get cdsFinalisationDate() {
    return $(
      '//table[@aria-label="Latest activity for CDS"]//td[normalize-space(.)="Finalisation"]/following-sibling::td[1]'
    )
  }

  get ipaffsNotificationDate() {
    return $(
      '//table[@aria-label="Latest activity for IPAFFS"]//td[normalize-space(.)="Notification"]/following-sibling::td[1]'
    )
  }

  async isBtmsHeaderVisible() {
    return await this.elementIsDisplayed(this.btmsHeader)
  }

  async isCdsHeaderVisible() {
    return await this.cdsHeader.isDisplayed()
  }

  async isIpaffsHeaderVisible() {
    return await this.ipaffsHeader.isDisplayed()
  }

  async isDecisionCreatedVisible() {
    return await this.decisionCreatedRow.isDisplayed()
  }

  async isDecisionSentVisible() {
    return await this.decisionSentRow.isDisplayed()
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
      this.isValidDate(this.btmsDecisionCreatedDate),
      this.isValidDate(this.btmsDecisionSentDate),
      this.isValidDate(this.cdsClearanceRequestDate),
      this.isValidDate(this.cdsFinalisationDate),
      this.isValidDate(this.ipaffsNotificationDate)
    ])
    return results.every(Boolean)
  }

  async clickNavLatestActivityLink() {
    await this.clickLink(this.navLatestActivityLink)
  }
}

export default new LatestActivityPage()
