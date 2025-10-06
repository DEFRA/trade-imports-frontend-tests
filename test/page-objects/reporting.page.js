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

  // Releases tiles (Summary tab)
  get releasesAutoSummary() {
    return $(
      'section[aria-labelledby="releases-summary-heading"] .btms-tile .key.automatic ~ .govuk-heading-l'
    )
  }

  async getReleasesAutoSummaryValue() {
    return Number(await this.releasesAutoSummary.getText())
  }

  get releasesManualSummary() {
    return $(
      'section[aria-labelledby="releases-summary-heading"] .btms-tile .key.manual ~ .govuk-heading-l'
    )
  }

  async getReleasesManualSummaryValue() {
    return Number(await this.releasesManualSummary.getText())
  }

  get releasesTotalSummary() {
    return $(
      'section[aria-labelledby="releases-summary-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  async getReleasesTotalSummaryValue() {
    return Number(await this.releasesTotalSummary.getText())
  }

  // Releases tiles (Chart tab)
  get releasesAutoChart() {
    return $(
      '#charts-view section[aria-labelledby="releases-charts-heading"] .btms-tile .key.automatic ~ .govuk-heading-l'
    )
  }

  async getReleasesAutoChartValue() {
    return Number(await this.releasesAutoChart.getText())
  }

  get releasesManualChart() {
    return $(
      '#charts-view section[aria-labelledby="releases-charts-heading"] .btms-tile .key.manual ~ .govuk-heading-l'
    )
  }

  async getReleasesManualChartValue() {
    return Number(await this.releasesManualChart.getText())
  }

  get releasesTotalChart() {
    return $(
      '#charts-view section[aria-labelledby="releases-charts-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  async getReleasesTotalChartValue() {
    return Number(await this.releasesTotalChart.getText())
  }

  // Unique clearance tiles (Summary tab)
  get uniqueClearancesSummary() {
    return $(
      'section[aria-labelledby="clearanceRequests-summary-heading"] .btms-tile .key.unique ~ .govuk-heading-l'
    )
  }

  async getUniqueClearancesSummaryValue() {
    return Number(await this.uniqueClearancesSummary.getText())
  }

  get uniqueClearancesTotalSummary() {
    return $(
      'section[aria-labelledby="clearanceRequests-summary-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  async getUniqueClearancesTotalSummaryValue() {
    return Number(await this.uniqueClearancesTotalSummary.getText())
  }

  // Unique clearance tiles (Chart tab)
  get uniqueClearancesChart() {
    return $(
      '#charts-view section[aria-labelledby="clearanceRequests-charts-heading"] .btms-tile .key.unique ~ .govuk-heading-l'
    )
  }

  async getUniqueClearancesChartValue() {
    return Number(await this.uniqueClearancesChart.getText())
  }

  get uniqueClearancesTotalChart() {
    return $(
      '#charts-view section[aria-labelledby="clearanceRequests-charts-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  async getUniqueClearancesTotalChartValue() {
    return Number(await this.uniqueClearancesTotalChart.getText())
  }

  // CHED notifications tiles (Summary tab)
  get chedASummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.cheda ~ .govuk-heading-l'
    )
  }

  async getChedASummaryValue() {
    return Number(await this.chedASummary.getText())
  }

  get chedPSummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.chedp ~ .govuk-heading-l'
    )
  }

  async getChedPSummaryValue() {
    return Number(await this.chedPSummary.getText())
  }

  get chedPPSummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.chedpp ~ .govuk-heading-l'
    )
  }

  async getChedPPSummaryValue() {
    return Number(await this.chedPPSummary.getText())
  }

  get chedDSummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.chedd ~ .govuk-heading-l'
    )
  }

  async getChedDSummaryValue() {
    return Number(await this.chedDSummary.getText())
  }

  get chedTotalSummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  async getChedTotalSummaryValue() {
    return Number(await this.chedTotalSummary.getText())
  }

  // CHED notifications tiles (Chart tab)
  get chedAChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.cheda ~ .govuk-heading-l'
    )
  }

  async getChedAChartValue() {
    return Number(await this.chedAChart.getText())
  }

  get chedPChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.chedp ~ .govuk-heading-l'
    )
  }

  async getChedPChartValue() {
    return Number(await this.chedPChart.getText())
  }

  get chedPPChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.chedpp ~ .govuk-heading-l'
    )
  }

  async getChedPPChartValue() {
    return Number(await this.chedPPChart.getText())
  }

  get chedDChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.chedd ~ .govuk-heading-l'
    )
  }

  async getChedDChartValue() {
    return Number(await this.chedDChart.getText())
  }

  get chedTotalChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  async getChedTotalChartValue() {
    return Number(await this.chedTotalChart.getText())
  }
}

export default new ReportingPage()
