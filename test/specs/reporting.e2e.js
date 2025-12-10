import { browser, expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page'
import ReportingPage from '../page-objects/reporting.page'
import SearchPage from 'page-objects/search.page.js'

describe('Reporting page', () => {
  it('Should be on the "Reporting" page', async () => {
    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }

    await ReportingPage.clickNavReportingLink()
    await expect(browser).toHaveTitle(
      'BTMS reporting data - Border Trade Matching Service'
    )
  })

  it('Shoult be able to use Todays filter', async () => {
    await ReportingPage.todayFilter()
    const currentDate = new Date()
    const day = String(currentDate.getDate())
    const month = currentDate.toLocaleString('default', { month: 'long' })
    const year = currentDate.getFullYear()
    const expectedReportPeriod = `${day} ${month} ${year} at 00:00 to ${day} ${month} ${year} at`
    await ReportingPage.todayFilter()
    expect(await ReportingPage.filterResult()).toContain(expectedReportPeriod)
  })

  it('Should be able to use Yesterday filter', async () => {
    const yesterdayDate = new Date(new Date().setDate(new Date().getDate() - 1))
    const yesterdayDay = String(yesterdayDate.getDate())
    const yesterdayMonth = yesterdayDate.toLocaleString('default', {
      month: 'long'
    })
    const yesterdayYear = yesterdayDate.getFullYear()

    const expectedReportPeriod = `${yesterdayDay} ${yesterdayMonth} ${yesterdayYear} at 00:00 to ${yesterdayDay} ${yesterdayMonth} ${yesterdayYear} at 23:59`
    await ReportingPage.yesterdayFilter()
    expect(await ReportingPage.filterResult()).toContain(expectedReportPeriod)
  })

  it('Should be able to use Last week filter', async () => {
    const currentDate = new Date()
    const day = String(currentDate.getDate())
    const month = currentDate.toLocaleString('default', { month: 'long' })
    const year = currentDate.getFullYear()
    const lastWeekDate = new Date(new Date().setDate(currentDate.getDate() - 6))
    const lastWeekDay = String(lastWeekDate.getDate())
    const lastWeekMonth = lastWeekDate.toLocaleString('default', {
      month: 'long'
    })
    const lastWeekYear = lastWeekDate.getFullYear()

    const expectedReportPeriod = `${lastWeekDay} ${lastWeekMonth} ${lastWeekYear} at 00:00 to ${day} ${month} ${year} at `
    await ReportingPage.lastWeekFilter()
    expect(await ReportingPage.filterResult()).toContain(expectedReportPeriod)
  })

  it('Should be able to use Last month filter', async () => {
    const currentDate = new Date()
    const day = String(currentDate.getDate())
    const month = currentDate.toLocaleString('default', { month: 'long' })
    const year = currentDate.getFullYear()
    const lastMonthDate = new Date(
      new Date().setDate(currentDate.getDate() - 29)
    )
    const lastMonthDay = String(lastMonthDate.getDate())
    const lastMonthMonth = lastMonthDate.toLocaleString('default', {
      month: 'long'
    })
    const lastMonthYear = lastMonthDate.getFullYear()

    const expectedReportPeriod = `${lastMonthDay} ${lastMonthMonth} ${lastMonthYear} at 00:00 to ${day} ${month} ${year} at `
    await ReportingPage.lastMonthFilter()
    expect(await ReportingPage.filterResult()).toContain(expectedReportPeriod)
    const hours = String(currentDate.getHours()).padStart(2, '0')
    const minutes = String(currentDate.getMinutes()).padStart(2, '0')
    const expectedDateTime = `${day} ${month} ${year} at ${hours}:${minutes}`
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

  it('should have the same releases numbers on summary and chart tabs', async () => {
    await ReportingPage.lastMonthFilter()
    await ReportingPage.openSummaryTab()
    const summaryAuto = await ReportingPage.getReleasesAutoSummaryValue()
    const summaryManual = await ReportingPage.getReleasesManualSummaryValue()
    const summaryTotal = await ReportingPage.getReleasesTotalSummaryValue()

    await ReportingPage.openChartTab()
    const chartAuto = await ReportingPage.getReleasesAutoChartValue()
    const chartManual = await ReportingPage.getReleasesManualChartValue()
    const chartTotal = await ReportingPage.getReleasesTotalChartValue()

    expect(chartAuto).toEqual(summaryAuto)
    expect(chartManual).toEqual(summaryManual)
    expect(chartTotal).toEqual(summaryTotal)
  })

  it('should have the same unique clearance request numbers on summary and chart tabs', async () => {
    await ReportingPage.lastMonthFilter()
    await ReportingPage.openSummaryTab()
    const summaryUnique = await ReportingPage.getUniqueClearancesSummaryValue()
    const summaryTotal =
      await ReportingPage.getUniqueClearancesTotalSummaryValue()

    await ReportingPage.openChartTab()
    const chartUnique = await ReportingPage.getUniqueClearancesChartValue()
    const chartTotal = await ReportingPage.getUniqueClearancesTotalChartValue()

    expect(chartUnique).toEqual(summaryUnique)
    expect(chartTotal).toEqual(summaryTotal)
  })

  it('should have the same CHED type numbers on summary and chart tabs', async () => {
    await ReportingPage.lastMonthFilter()
    await ReportingPage.openSummaryTab()
    const summaryA = await ReportingPage.getChedASummaryValue()
    const summaryP = await ReportingPage.getChedPSummaryValue()
    const summaryPP = await ReportingPage.getChedPPSummaryValue()
    const summaryD = await ReportingPage.getChedDSummaryValue()
    const summaryTotal = await ReportingPage.getChedTotalSummaryValue()

    await ReportingPage.openChartTab()
    const chartA = await ReportingPage.getChedAChartValue()
    const chartP = await ReportingPage.getChedPChartValue()
    const chartPP = await ReportingPage.getChedPPChartValue()
    const chartD = await ReportingPage.getChedDChartValue()
    const chartTotal = await ReportingPage.getChedTotalChartValue()

    expect(chartA).toEqual(summaryA)
    expect(chartP).toEqual(summaryP)
    expect(chartPP).toEqual(summaryPP)
    expect(chartD).toEqual(summaryD)
    expect(chartTotal).toEqual(summaryTotal)
  })
})
