import { Page } from './page.js'

class ReportingPage extends Page {
  open() {
    return super.open('/reporting')
  }

  get todayLink() {
    return $('.btms-reporting-filters a')
  }

  get filterResultText() {
    return $('.govuk-grid-column-three-quarters .govuk-heading-s')
  }

  get matches() {
    return $('section[aria-labelledby="matches-summary-heading"]')
  }

  get releases() {
    return $('section[aria-labelledby="releases"]')
  }

  get clearanceRequests() {
    return $('section[aria-labelledby="clearanceRequests"]')
  }

  get notifications() {
    return $('section[aria-labelledby="notifications"]')
  }

  async todayFilter() {
    return await this.clickLink(this.todayLink)
  }

  async filterResult() {
    return await this.getTextFrom(this.filterResultText)
  }

  async matchesSectionIsVisible() {
    return await this.elementIsDisplayed(this.matches)
  }

  async releasesSectionIsVisible() {
    return await this.elementIsDisplayed(this.matches)
  }

  async clearanceRequestSectionIsVisible() {
    return await this.elementIsDisplayed(this.matches)
  }

  async notificationSectionIsVisible() {
    return await this.elementIsDisplayed(this.matches)
  }
}

export default new ReportingPage()
