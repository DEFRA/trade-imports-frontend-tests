import { browser, expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page'
import ReportingPage from '../page-objects/reporting.page'

describe('Home page', () => {
  it('Should be on the "Reporting" page', async () => {
    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await ReportingPage.open()
    await expect(browser).toHaveTitle(
      'BTMS reporting data - Border Trade Matching Service'
    )
  })

  it('Shoult be able to use Todays filter', async () => {
    const currentDate = new Date()
    const day = String(currentDate.getDate())
    const month = currentDate.toLocaleString('default', { month: 'long' })
    const year = currentDate.getFullYear()
    const hours = String(currentDate.getHours()).padStart(2, '0')
    const minutes = String(currentDate.getMinutes()).padStart(2, '0')

    const expectedDateTime = `${day} ${month} ${year} at ${hours}:${minutes}`
    await ReportingPage.todayFilter()
    expect(await ReportingPage.filterResult()).toContain(expectedDateTime)
  })

  it('Should be able to see all sections', async () => {
    expect(await ReportingPage.matchesSectionIsVisible()).toBe(true)
    expect(await ReportingPage.releasesSectionIsVisible()).toBe(true)
    expect(await ReportingPage.clearanceRequestSectionIsVisible()).toBe(true)
    expect(await ReportingPage.notificationSectionIsVisible()).toBe(true)
  })

  it('should display chart view and matches chart', async () => {
    await ReportingPage.openChartTab()
    expect(await ReportingPage.matchesChartIsVisible()).toBe(true)
  })

  it('should open summary tab and see matches section', async () => {
    await ReportingPage.openSummaryTab()
    expect(await ReportingPage.matchesSectionIsVisible()).toBe(true)
  })

  it('should have the same matches, no matches, and total numbers on summary and chart tabs', async () => {
    // Apply the last month filter before running the comparison
    await ReportingPage.lastMonthFilter()

    // Go to summary tab and get numbers using page object methods
    await ReportingPage.openSummaryTab()
    const summaryMatches = await ReportingPage.getSummaryMatches()
    const summaryNoMatches = await ReportingPage.getSummaryNoMatches()
    const summaryTotal = await ReportingPage.getSummaryTotal()

    // Go to chart tab and get numbers using page object methods
    await ReportingPage.openChartTab()
    const chartMatches = await ReportingPage.getChartMatches()
    const chartNoMatches = await ReportingPage.getChartNoMatches()
    const chartTotal = await ReportingPage.getChartTotal()

    // Compare values
    expect(chartMatches).toEqual(summaryMatches)
    expect(chartNoMatches).toEqual(summaryNoMatches)
    expect(chartTotal).toEqual(summaryTotal)
  })
})
