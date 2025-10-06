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
    return $('section[aria-labelledby="releases-summary-heading"]')
  }

  get clearanceRequests() {
    return $('section[aria-labelledby="clearanceRequests-summary-heading"]')
  }

  get notifications() {
    return $('section[aria-labelledby="notifications-summary-heading"]')
  }

  // New: Chart tab and chart section selectors
  get chartTab() {
    return $('#tab_charts-view')
  }

  get matchesChartHeading() {
    return $('#matches-charts-heading')
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
    return await this.elementIsDisplayed(this.releases)
  }

  async clearanceRequestSectionIsVisible() {
    return await this.elementIsDisplayed(this.clearanceRequests)
  }

  async notificationSectionIsVisible() {
    return await this.elementIsDisplayed(this.notifications)
  }

  // New: Chart tab actions
  async openChartTab() {
    await this.clickLink(this.chartTab)
  }

  async matchesChartIsVisible() {
    return await this.elementIsDisplayed(this.matchesChartHeading)
  }
}

export default new ReportingPage()
