import { browser, expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page'
import ReportingPage from '../page-objects/reporting.page'
import SearchPage from 'page-objects/search.page.js'

describe('Reporting page', () => {
  it('Should see the correct heading on the "Reporting" page', async () => {
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

  it('Should be able to use Todays filter and see time period updated', async () => {
    await ReportingPage.todayFilter()
    const currentDate = new Date()
    const day = String(currentDate.getDate())
    const month = currentDate.toLocaleString('default', { month: 'long' })
    const year = currentDate.getFullYear()
    const expectedReportPeriod = `${day} ${month} ${year} at 00:00 to ${day} ${month} ${year} at`
    expect(await ReportingPage.filterResult()).toContain(expectedReportPeriod)
  })

  it('Should be able to use Yesterday filter and see time period updated', async () => {
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

  it('Should be able to use Last week filter and see time period updated', async () => {
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

  it('Should be able to use Last month filter and see time period updated', async () => {
    await ReportingPage.lastMonthFilter()
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
    expect(await ReportingPage.filterResult()).toContain(expectedReportPeriod)
  })

  it('Should be able to see all Summary sections under Summary tab', async () => {
    await ReportingPage.openSummaryTab()
    expect(await ReportingPage.matchesSectionIsVisible()).toBe(true)
    expect(await ReportingPage.releasesSectionIsVisible()).toBe(true)
    expect(await ReportingPage.clearanceRequestSectionIsVisible()).toBe(true)
    expect(await ReportingPage.notificationSectionIsVisible()).toBe(true)
  })

  it('Should be able to see all Charts sections under Chart tab', async () => {
    await ReportingPage.openChartTab()
    expect(await ReportingPage.matchesChartIsVisible()).toBe(true)
    expect(await ReportingPage.releasesChartIsVisible()).toBe(true)
    expect(await ReportingPage.clearancesChartIsVisible()).toBe(true)
    expect(await ReportingPage.notificationsChartIsVisible()).toBe(true)
  })

  it('should see the same Matches, No Matches, and Total Matches for both Summary and Chart tabs', async () => {
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
    expect(summaryMatches).toEqual(chartMatches)
    expect(summaryNoMatches).toEqual(chartNoMatches)
    expect(summaryTotal).toEqual(chartTotal)
  })

  it('should see the same Automatic, Manual, and Total Releases for the Summary and Chart tabs', async () => {
    await ReportingPage.lastMonthFilter()
    await ReportingPage.openSummaryTab()
    const summaryAuto = await ReportingPage.getReleasesAutoSummaryValue()
    const summaryManual = await ReportingPage.getReleasesManualSummaryValue()
    const summaryTotal = await ReportingPage.getReleasesTotalSummaryValue()

    await ReportingPage.openChartTab()
    const chartAuto = await ReportingPage.getReleasesAutoChartValue()
    const chartManual = await ReportingPage.getReleasesManualChartValue()
    const chartTotal = await ReportingPage.getReleasesTotalChartValue()

    expect(summaryAuto).toEqual(chartAuto)
    expect(summaryManual).toEqual(chartManual)
    expect(summaryTotal).toEqual(chartTotal)
  })

  it('should see the same Unique Clearance and Total Clearance for the Summary and Chart tabs', async () => {
    await ReportingPage.lastMonthFilter()
    await ReportingPage.openSummaryTab()
    const summaryUnique = await ReportingPage.getUniqueClearancesSummaryValue()
    const summaryTotal =
      await ReportingPage.getUniqueClearancesTotalSummaryValue()

    await ReportingPage.openChartTab()
    const chartUnique = await ReportingPage.getUniqueClearancesChartValue()
    const chartTotal = await ReportingPage.getUniqueClearancesTotalChartValue()

    expect(summaryUnique).toEqual(chartUnique)
    expect(summaryTotal).toEqual(chartTotal)
  })

  it('should see the same CHED-A, CHED-P, CHED-PP, CHED-D and Total CHEDS for the Summary and Chart tabs', async () => {
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

    expect(summaryA).toEqual(chartA)
    expect(summaryP).toEqual(chartP)
    expect(summaryPP).toEqual(chartPP)
    expect(summaryD).toEqual(chartD)
    expect(summaryTotal).toEqual(chartTotal)
  })

  it('Should see all headings matching between Summary and Chart tabs', async () => {
    await ReportingPage.openSummaryTab()
    const summaryTabMatchesHeading =
      await ReportingPage.getSummaryMatchesHeading()
    const summaryTabNoMatchesHeading =
      await ReportingPage.getSummaryNoMatchesHeading()
    const summaryTabTotalHeading = await ReportingPage.getSummaryTotalHeading()

    const summaryTabAutoReleaseHeading =
      await ReportingPage.getReleasesAutoSummaryHeading()
    const summaryTabManualReleaseHeading =
      await ReportingPage.getReleasesManualSummaryHeading()
    const summaryTabTotalReleaseHeading =
      await ReportingPage.getReleasesTotalSummaryHeading()

    const summaryTabUniqueClearancesHeading =
      await ReportingPage.getUniqueClearancesSummaryHeading()
    const summaryTabUniqueClearancesTotalHeading =
      await ReportingPage.getUniqueClearancesTotalSummaryHeading()

    const summaryTabChedAHeading = await ReportingPage.getChedAHeading()
    const summaryTabChedPHeading = await ReportingPage.getChedPHeading()
    const summaryTabChedPPHeading = await ReportingPage.getChedPPHeading()
    const summaryTabChedDHeading = await ReportingPage.getChedDHeading()
    const summaryTabChedTotalHeading = await ReportingPage.getChedTotalHeading()

    await ReportingPage.openChartTab()
    const chartTabMatchesHeading = await ReportingPage.getChartMatchesHeading()
    const chartTabNoMatchesHeading =
      await ReportingPage.getChartNoMatchesHeading()
    const chartTabTotalHeading = await ReportingPage.getChartTotalHeading()

    const chartTabAutoReleaseHeading =
      await ReportingPage.getReleasesAutoChartHeading()
    const chartTabManualReleaseHeading =
      await ReportingPage.getReleasesManualChartHeading()
    const chartTabTotalReleaseHeading =
      await ReportingPage.getReleasesTotalChartHeading()

    const chartTabUniqueClearancesHeading =
      await ReportingPage.getUniqueClearancesChartHeading()
    const chartTabUniqueClearancesTotalHeading =
      await ReportingPage.getUniqueClearancesTotalChartHeading()

    const chartTabChedAHeading = await ReportingPage.getChedAChartHeading()
    const chartTabChedPHeading = await ReportingPage.getChedPChartHeading()
    const chartTabChedPPHeading = await ReportingPage.getChedPPChartHeading()
    const chartTabChedDHeading = await ReportingPage.getChedDChartHeading()
    const chartTabChedTotalHeading =
      await ReportingPage.getChedTotalChartHeading()

    expect(summaryTabMatchesHeading).toEqual('Matches')
    expect(summaryTabNoMatchesHeading).toEqual('No matches')
    expect(summaryTabTotalHeading).toEqual('Total')

    expect(summaryTabAutoReleaseHeading).toEqual('Automatic')
    expect(summaryTabManualReleaseHeading).toEqual('Manual')
    expect(summaryTabTotalReleaseHeading).toEqual('Total')

    expect(summaryTabUniqueClearancesHeading).toEqual('Unique clearances')
    expect(summaryTabUniqueClearancesTotalHeading).toEqual('Total')

    expect(summaryTabChedAHeading).toEqual('CHED A')
    expect(summaryTabChedPHeading).toEqual('CHED P')
    expect(summaryTabChedPPHeading).toEqual('CHED PP')
    expect(summaryTabChedDHeading).toEqual('CHED D')
    expect(summaryTabChedTotalHeading).toEqual('Total')

    expect(summaryTabMatchesHeading).toEqual(chartTabMatchesHeading)
    expect(summaryTabNoMatchesHeading).toEqual(chartTabNoMatchesHeading)
    expect(summaryTabTotalHeading).toEqual(chartTabTotalHeading)

    expect(summaryTabAutoReleaseHeading).toEqual(chartTabAutoReleaseHeading)
    expect(summaryTabManualReleaseHeading).toEqual(chartTabManualReleaseHeading)
    expect(summaryTabTotalReleaseHeading).toEqual(chartTabTotalReleaseHeading)

    expect(summaryTabUniqueClearancesHeading).toEqual(
      chartTabUniqueClearancesHeading
    )
    expect(summaryTabUniqueClearancesTotalHeading).toEqual(
      chartTabUniqueClearancesTotalHeading
    )

    expect(summaryTabChedAHeading).toEqual(chartTabChedAHeading)
    expect(summaryTabChedPHeading).toEqual(chartTabChedPHeading)
    expect(summaryTabChedPPHeading).toEqual(chartTabChedPPHeading)
    expect(summaryTabChedDHeading).toEqual(chartTabChedDHeading)
    expect(summaryTabChedTotalHeading).toEqual(chartTabChedTotalHeading)
  })
})
