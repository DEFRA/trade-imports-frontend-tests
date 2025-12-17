import { Page } from './page.js'

class ReportingPage extends Page {
  get navReportingLink() {
    return $('a.govuk-service-navigation__link[href="/reporting"]')
  }

  // Filter links
  get todayLink() {
    return $('=Today')
  }

  get yesterdayLink() {
    return $('=Yesterday')
  }

  get lastWeekLink() {
    return $('=Last week')
  }

  get lastMonthLink() {
    return $('=Last month')
  }

  get filterResultText() {
    return $('.govuk-grid-column-three-quarters .govuk-heading-s')
  }

  // Tabs
  get summaryTab() {
    return $('#tab_summary-view')
  }

  get chartTab() {
    return $('#tab_charts-view')
  }

  // Summary Tab Sections
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

  // Chart Tab Headings
  get matchesChartHeading() {
    return $('#matches-charts-heading')
  }

  get releasesChartHeading() {
    return $('#releases-charts-heading')
  }

  get clearancesChartHeading() {
    return $('#clearanceRequests-charts-heading')
  }

  get notificationsChartHeading() {
    return $('#notifications-charts-heading')
  }

  // Matches tiles (Summary tab)
  get matchesTileHeading() {
    return $('.btms-tile .match')
  }

  get noMatchesTileHeading() {
    return $('.btms-tile .nomatch')
  }

  get totalTileHeading() {
    return $('.btms-tile .total')
  }

  get matchesTileSummary() {
    return $('.btms-tile .key.match ~ .govuk-heading-l')
  }

  get noMatchesTileSummary() {
    return $('.btms-tile .key.nomatch ~ .govuk-heading-l')
  }

  get totalTileSummary() {
    return $('.btms-tile .total ~ .govuk-heading-l')
  }

  // Matches tiles (Chart tab)
  get matchesTileChartHeading() {
    return $('#charts-view .btms-tile .key.match')
  }

  get noMatchesTileChartHeading() {
    return $('#charts-view .btms-tile .key.nomatch')
  }

  get totalTileChartHeading() {
    return $('#charts-view .btms-tile .total')
  }

  get matchesTileChart() {
    return $('#charts-view .btms-tile .key.match ~ .govuk-heading-l')
  }

  get noMatchesTileChart() {
    return $('#charts-view .btms-tile .key.nomatch ~ .govuk-heading-l')
  }

  get totalTileChart() {
    return $('#charts-view .btms-tile .total ~ .govuk-heading-l')
  }

  // Releases tiles (Summary tab)
  get releasesAutoHeading() {
    return $(
      'section[aria-labelledby="releases-summary-heading"] .btms-tile .key.automatic'
    )
  }

  get releasesManualHeading() {
    return $(
      'section[aria-labelledby="releases-summary-heading"] .btms-tile .key.manual'
    )
  }

  get releasesTotalHeading() {
    return $(
      'section[aria-labelledby="releases-summary-heading"] .btms-tile .total'
    )
  }

  get releasesAutoSummary() {
    return $(
      'section[aria-labelledby="releases-summary-heading"] .btms-tile .key.automatic ~ .govuk-heading-l'
    )
  }

  get releasesManualSummary() {
    return $(
      'section[aria-labelledby="releases-summary-heading"] .btms-tile .key.manual ~ .govuk-heading-l'
    )
  }

  get releasesTotalSummary() {
    return $(
      'section[aria-labelledby="releases-summary-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  // Releases tiles (Chart tab)
  get releasesAutoChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="releases-charts-heading"] .btms-tile .key.automatic'
    )
  }

  get releasesManualChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="releases-charts-heading"] .btms-tile .key.manual'
    )
  }

  get releasesTotalChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="releases-charts-heading"] .btms-tile .total'
    )
  }

  get releasesAutoChart() {
    return $(
      '#charts-view section[aria-labelledby="releases-charts-heading"] .btms-tile .key.automatic ~ .govuk-heading-l'
    )
  }

  get releasesManualChart() {
    return $(
      '#charts-view section[aria-labelledby="releases-charts-heading"] .btms-tile .key.manual ~ .govuk-heading-l'
    )
  }

  get releasesTotalChart() {
    return $(
      '#charts-view section[aria-labelledby="releases-charts-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  // Unique clearance tiles (Summary tab)
  get uniqueClearancesSummary() {
    return $(
      'section[aria-labelledby="clearanceRequests-summary-heading"] .btms-tile .key.unique ~ .govuk-heading-l'
    )
  }

  get uniqueClearancesTotalSummary() {
    return $(
      'section[aria-labelledby="clearanceRequests-summary-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  get uniqueClearancesHeading() {
    return $(
      'section[aria-labelledby="clearanceRequests-summary-heading"] .btms-tile .key.unique'
    )
  }

  get uniqueClearancesTotalHeading() {
    return $(
      'section[aria-labelledby="clearanceRequests-summary-heading"] .btms-tile .total'
    )
  }

  // Unique clearance tiles (Chart tab)
  get uniqueClearancesChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="clearanceRequests-charts-heading"] .btms-tile .key.unique'
    )
  }

  get uniqueClearancesTotalChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="clearanceRequests-charts-heading"] .btms-tile .total'
    )
  }

  get uniqueClearancesChart() {
    return $(
      '#charts-view section[aria-labelledby="clearanceRequests-charts-heading"] .btms-tile .key.unique ~ .govuk-heading-l'
    )
  }

  get uniqueClearancesTotalChart() {
    return $(
      '#charts-view section[aria-labelledby="clearanceRequests-charts-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  // CHED notifications tiles (Summary tab)
  get chedASummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.cheda ~ .govuk-heading-l'
    )
  }

  get chedPSummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.chedp ~ .govuk-heading-l'
    )
  }

  get chedPPSummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.chedpp ~ .govuk-heading-l'
    )
  }

  get chedDSummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.chedd ~ .govuk-heading-l'
    )
  }

  get chedTotalSummary() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  get chedAHeading() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.cheda'
    )
  }

  get chedPHeading() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.chedp'
    )
  }

  get chedPPHeading() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.chedpp'
    )
  }

  get chedDHeading() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .key.chedd'
    )
  }

  get chedTotalHeading() {
    return $(
      'section[aria-labelledby="notifications-summary-heading"] .btms-tile .total'
    )
  }

  // CHED notifications tiles (Chart tab)
  get chedAChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.cheda'
    )
  }

  get chedPChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.chedp'
    )
  }

  get chedPPChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.chedpp'
    )
  }

  get chedDChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.chedd'
    )
  }

  get chedTotalChartHeading() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .total'
    )
  }

  get chedAChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.cheda ~ .govuk-heading-l'
    )
  }

  get chedPChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.chedp ~ .govuk-heading-l'
    )
  }

  get chedPPChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.chedpp ~ .govuk-heading-l'
    )
  }

  get chedDChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .key.chedd ~ .govuk-heading-l'
    )
  }

  get chedTotalChart() {
    return $(
      '#charts-view section[aria-labelledby="notifications-charts-heading"] .btms-tile .total ~ .govuk-heading-l'
    )
  }

  open() {
    return super.open('/reporting')
  }

  async todayFilter() {
    return await this.clickLink(this.todayLink)
  }

  async yesterdayFilter() {
    return await this.clickLink(this.yesterdayLink)
  }

  async lastWeekFilter() {
    return await this.clickLink(this.lastWeekLink)
  }

  async lastMonthFilter() {
    return await this.clickLink(this.lastMonthLink)
  }

  async filterResult() {
    return await this.getTextFrom(this.filterResultText)
  }

  async openSummaryTab() {
    await this.clickLink(this.summaryTab)
  }

  async openChartTab() {
    await this.clickLink(this.chartTab)
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

  async matchesChartIsVisible() {
    return await this.elementIsDisplayed(this.matchesChartHeading)
  }

  async releasesChartIsVisible() {
    return await this.elementIsDisplayed(this.releasesChartHeading)
  }

  async clearancesChartIsVisible() {
    return await this.elementIsDisplayed(this.clearancesChartHeading)
  }

  async notificationsChartIsVisible() {
    return await this.elementIsDisplayed(this.notificationsChartHeading)
  }

  async getSummaryMatches() {
    return Number(await this.matchesTileSummary.getText())
  }

  async getSummaryNoMatches() {
    return Number(await this.noMatchesTileSummary.getText())
  }

  async getSummaryTotal() {
    return Number(await this.totalTileSummary.getText())
  }

  async getSummaryMatchesHeading() {
    return Number(await this.matchesTileHeading.getText())
  }

  async getSummaryNoMatchesHeading() {
    return Number(await this.noMatchesTileHeading.getText())
  }

  async getSummaryTotalHeading() {
    return Number(await this.totalTileHeading.getText())
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

  async getChartMatchesHeading() {
    return Number(await this.matchesTileChartHeading.getText())
  }

  async getChartNoMatchesHeading() {
    return Number(await this.noMatchesTileChartHeading.getText())
  }

  async getChartTotalHeading() {
    return Number(await this.totalTileChartHeading.getText())
  }

  async getReleasesAutoSummaryValue() {
    return Number(await this.releasesAutoSummary.getText())
  }

  async getReleasesManualSummaryValue() {
    return Number(await this.releasesManualSummary.getText())
  }

  async getReleasesTotalSummaryValue() {
    return Number(await this.releasesTotalSummary.getText())
  }

  async getReleasesAutoSummaryHeading() {
    return Number(await this.releasesAutoHeading.getText())
  }

  async getReleasesManualSummaryHeading() {
    return Number(await this.releasesManualHeading.getText())
  }

  async getReleasesTotalSummaryHeading() {
    return Number(await this.releasesTotalHeading.getText())
  }

  async getReleasesAutoChartValue() {
    return Number(await this.releasesAutoChart.getText())
  }

  async getReleasesManualChartValue() {
    return Number(await this.releasesManualChart.getText())
  }

  async getReleasesTotalChartValue() {
    return Number(await this.releasesTotalChart.getText())
  }

  async getReleasesAutoChartHeading() {
    return Number(await this.releasesAutoChartHeading.getText())
  }

  async getReleasesManualChartHeading() {
    return Number(await this.releasesManualChartHeading.getText())
  }

  async getReleasesTotalChartHeading() {
    return Number(await this.releasesTotalChartHeading.getText())
  }

  async getUniqueClearancesSummaryValue() {
    return Number(await this.uniqueClearancesSummary.getText())
  }

  async getUniqueClearancesTotalSummaryValue() {
    return Number(await this.uniqueClearancesTotalSummary.getText())
  }

  async getUniqueClearancesSummaryHeading() {
    return Number(await this.uniqueClearancesHeading.getText())
  }

  async getUniqueClearancesTotalSummaryHeading() {
    return Number(await this.uniqueClearancesTotalHeading.getText())
  }

  async getUniqueClearancesChartValue() {
    return Number(await this.uniqueClearancesChart.getText())
  }

  async getUniqueClearancesTotalChartValue() {
    return Number(await this.uniqueClearancesTotalChart.getText())
  }

  async getUniqueClearancesChartHeading() {
    return Number(await this.uniqueClearancesChartHeading.getText())
  }

  async getUniqueClearancesTotalChartHeading() {
    return Number(await this.uniqueClearancesTotalChartHeading.getText())
  }

  async getChedASummaryValue() {
    return Number(await this.chedASummary.getText())
  }

  async getChedPSummaryValue() {
    return Number(await this.chedPSummary.getText())
  }

  async getChedPPSummaryValue() {
    return Number(await this.chedPPSummary.getText())
  }

  async getChedDSummaryValue() {
    return Number(await this.chedDSummary.getText())
  }

  async getChedTotalSummaryValue() {
    return Number(await this.chedTotalSummary.getText())
  }

  async getChedAHeading() {
    return Number(await this.chedAHeading.getText())
  }

  async getChedPHeading() {
    return Number(await this.chedPHeading.getText())
  }

  async getChedPPHeading() {
    return Number(await this.chedPPHeading.getText())
  }

  async getChedDHeading() {
    return Number(await this.chedDHeading.getText())
  }

  async getChedTotalHeading() {
    return Number(await this.chedTotalHeading.getText())
  }

  async getChedAChartValue() {
    return Number(await this.chedAChart.getText())
  }

  async getChedPChartValue() {
    return Number(await this.chedPChart.getText())
  }

  async getChedPPChartValue() {
    return Number(await this.chedPPChart.getText())
  }

  async getChedDChartValue() {
    return Number(await this.chedDChart.getText())
  }

  async getChedTotalChartValue() {
    return Number(await this.chedTotalChart.getText())
  }

  async getChedAChartHeading() {
    return Number(await this.chedAChartHeading.getText())
  }

  async getChedPChartHeading() {
    return Number(await this.chedPChartHeading.getText())
  }

  async getChedPPChartHeading() {
    return Number(await this.chedPPChartHeading.getText())
  }

  async getChedDChartHeading() {
    return Number(await this.chedDChartHeading.getText())
  }

  async getChedTotalChartHeading() {
    return Number(await this.chedTotalChartHeading.getText())
  }

  async clickNavReportingLink() {
    await this.clickLink(this.navReportingLink)
  }
}

export default new ReportingPage()
