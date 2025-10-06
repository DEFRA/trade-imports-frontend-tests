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

  // Summary view tab selector
  get summaryTab() {
    return $('#tab_summary-view')
  }

  // Chart tab and chart section selectors
  get chartTab() {
    return $('#tab_charts-view')
  }

  get matchesChartHeading() {
    return $('#matches-charts-heading')
  }

  // Summary tab tiles
  get matchesTileSummary() {
    return $('.btms-tile .key.match ~ .govuk-heading-l')
  }

  get noMatchesTileSummary() {
    return $('.btms-tile .key.nomatch ~ .govuk-heading-l')
  }

  get totalTileSummary() {
    return $('.btms-tile .total ~ .govuk-heading-l')
  }

  // Chart tab tiles
  get matchesTileChart() {
    return $('#charts-view .btms-tile .key.match ~ .govuk-heading-l')
  }

  get noMatchesTileChart() {
    return $('#charts-view .btms-tile .key.nomatch ~ .govuk-heading-l')
  }

  get totalTileChart() {
    return $('#charts-view .btms-tile .total ~ .govuk-heading-l')
  }

  get lastMonthLink() {
    return $('=Last month')
  }

  async todayFilter() {
    return await this.clickLink(this.todayLink)
  }

  async lastMonthFilter() {
    return await this.clickLink(this.lastMonthLink)
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

  async openSummaryTab() {
    await this.clickLink(this.summaryTab)
  }

  async openChartTab() {
    await this.clickLink(this.chartTab)
  }

  async matchesChartIsVisible() {
    return await this.elementIsDisplayed(this.matchesChartHeading)
  }

  // Get tile numbers
  async getSummaryMatches() {
    return Number(await this.matchesTileSummary.getText())
  }

  async getSummaryNoMatches() {
    return Number(await this.noMatchesTileSummary.getText())
  }

  async getSummaryTotal() {
    return Number(await this.totalTileSummary.getText())
  }

  async getChartMatches() {
    return Number(await this.matchesTileChart.getText())
  }

  async getChartNoMatches() {
    return Number(await this.noMatchesTileChart.getText())
  }

  async getChartTotal() {
    return Number(await this.totalTileChart.getText())
  }
}

export default new ReportingPage()
