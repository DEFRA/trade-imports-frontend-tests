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

  it('Should be able to use Last Week filter and see time period updated', async () => {
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

  it('Should be able to use Last Month filter and see time period updated', async () => {
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

  it('Should show CSV download links for No matches and Manual releases and they are clickable', async () => {
    await ReportingPage.openSummaryTab()

    const noMatchesVisible =
      await ReportingPage.noMatchesDownloadLinkIsVisible()
    const noMatchesHref = await ReportingPage.getNoMatchesDownloadHref()

    const manualVisible =
      await ReportingPage.manualReleasesDownloadLinkIsVisible()
    const manualHref = await ReportingPage.getManualReleasesDownloadHref()

    expect(noMatchesVisible).toBe(true)
    expect(typeof noMatchesHref).toBe('string')
    expect(noMatchesHref.length).toBeGreaterThan(0)
    expect(noMatchesHref).toMatch(/no-matches\.csv/i)

    expect(manualVisible).toBe(true)
    expect(typeof manualHref).toBe('string')
    expect(manualHref.length).toBeGreaterThan(0)
    expect(manualHref).toMatch(/manual-releases\.csv/i)
  })

  it('Should be able to see all Charts sections under Chart tab', async () => {
    await ReportingPage.openChartTab()
    expect(await ReportingPage.matchesChartIsVisible()).toBe(true)
    expect(await ReportingPage.releasesChartIsVisible()).toBe(true)
    expect(await ReportingPage.clearancesChartIsVisible()).toBe(true)
    expect(await ReportingPage.notificationsChartIsVisible()).toBe(true)
  })

  it('Should see the same headings for Matches, Releases, Unique Clearances and Pre-Notifications panels across both Summary and Charts Tabs', async () => {
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

  it('Should see the same values for Matches, Releases, Unique Clearances and Pre-Notifications panels across both Summary and Charts Tabs', async () => {
    await ReportingPage.lastMonthFilter()

    await ReportingPage.openSummaryTab()
    const summaryMatches = await ReportingPage.getSummaryMatches()
    const summaryNoMatches = await ReportingPage.getSummaryNoMatches()
    const summaryMatchesTotal = await ReportingPage.getSummaryTotal()

    const summaryAuto = await ReportingPage.getReleasesAutoSummaryValue()
    const summaryManual = await ReportingPage.getReleasesManualSummaryValue()
    const summaryReleasesTotal =
      await ReportingPage.getReleasesTotalSummaryValue()

    const summaryClearanceUnique =
      await ReportingPage.getUniqueClearancesSummaryValue()
    const summaryClearanceTotal =
      await ReportingPage.getUniqueClearancesTotalSummaryValue()

    const summaryA = await ReportingPage.getChedASummaryValue()
    const summaryP = await ReportingPage.getChedPSummaryValue()
    const summaryPP = await ReportingPage.getChedPPSummaryValue()
    const summaryD = await ReportingPage.getChedDSummaryValue()
    const summaryTotal = await ReportingPage.getChedTotalSummaryValue()

    await ReportingPage.openChartTab()
    const chartMatches = await ReportingPage.getChartMatches()
    const chartNoMatches = await ReportingPage.getChartNoMatches()
    const chartMatchesTotal = await ReportingPage.getChartTotal()

    const chartAuto = await ReportingPage.getReleasesAutoChartValue()
    const chartManual = await ReportingPage.getReleasesManualChartValue()
    const chartReleasesTotal = await ReportingPage.getReleasesTotalChartValue()

    const chartClearanceUnique =
      await ReportingPage.getUniqueClearancesChartValue()
    const chartClearanceTotal =
      await ReportingPage.getUniqueClearancesTotalChartValue()

    const chartA = await ReportingPage.getChedAChartValue()
    const chartP = await ReportingPage.getChedPChartValue()
    const chartPP = await ReportingPage.getChedPPChartValue()
    const chartD = await ReportingPage.getChedDChartValue()
    const chartTotal = await ReportingPage.getChedTotalChartValue()

    expect(summaryMatches).toEqual(chartMatches)
    expect(summaryNoMatches).toEqual(chartNoMatches)
    expect(summaryMatchesTotal).toEqual(chartMatchesTotal)

    expect(summaryAuto).toEqual(chartAuto)
    expect(summaryManual).toEqual(chartManual)
    expect(summaryReleasesTotal).toEqual(chartReleasesTotal)

    expect(summaryClearanceUnique).toEqual(chartClearanceUnique)
    expect(summaryClearanceTotal).toEqual(chartClearanceTotal)

    expect(summaryA).toEqual(chartA)
    expect(summaryP).toEqual(chartP)
    expect(summaryPP).toEqual(chartPP)
    expect(summaryD).toEqual(chartD)
    expect(summaryTotal).toEqual(chartTotal)
  })

  it('Should see the same percentages for Matches, Releases, Unique Clearances and Pre-Notifications panels across both Summary and Charts Tabs', async () => {
    await ReportingPage.lastMonthFilter()

    await ReportingPage.openSummaryTab()
    const summaryMatchesPct = await ReportingPage.getSummaryMatchesPercentage()
    const summaryNoMatchesPct =
      await ReportingPage.getSummaryNoMatchesPercentage()

    const summaryAutoPct =
      await ReportingPage.getReleasesAutoSummaryPercentageValue()
    const summaryManualPct =
      await ReportingPage.getReleasesManualSummaryPercentageValue()

    const summaryUniquePct =
      await ReportingPage.getUniqueClearancesSummaryPercentageValue()

    const summaryAPct = await ReportingPage.getChedASummaryPercentageValue()
    const summaryPPct = await ReportingPage.getChedPSummaryPercentageValue()
    const summaryPPPct = await ReportingPage.getChedPPSummaryPercentageValue()
    const summaryDPct = await ReportingPage.getChedDSummaryPercentageValue()

    await ReportingPage.openChartTab()
    const chartMatchesPct = await ReportingPage.getChartMatchesPercentage()
    const chartNoMatchesPct = await ReportingPage.getChartNoMatchesPercentage()

    const chartAutoPct =
      await ReportingPage.getReleasesAutoChartPercentageValue()
    const chartManualPct =
      await ReportingPage.getReleasesManualChartPercentageValue()

    const chartUniquePct =
      await ReportingPage.getUniqueClearancesChartPercentageValue()

    const chartAPct = await ReportingPage.getChedAChartPercentageValue()
    const chartPPct = await ReportingPage.getChedPChartPercentageValue()
    const chartPPPct = await ReportingPage.getChedPPChartPercentageValue()
    const chartDPct = await ReportingPage.getChedDChartPercentageValue()

    expect(summaryMatchesPct).toEqual(chartMatchesPct)
    expect(summaryNoMatchesPct).toEqual(chartNoMatchesPct)

    expect(summaryAutoPct).toEqual(chartAutoPct)
    expect(summaryManualPct).toEqual(chartManualPct)

    expect(summaryUniquePct).toEqual(chartUniquePct)

    expect(summaryAPct).toEqual(chartAPct)
    expect(summaryPPct).toEqual(chartPPct)
    expect(summaryPPPct).toEqual(chartPPPct)
    expect(summaryDPct).toEqual(chartDPct)
  })

  it('Should validate percentage calculations across Summary tiles', async () => {
    await ReportingPage.openSummaryTab()

    const matchesPct = await ReportingPage.getSummaryMatchesPercentage()
    const noMatchesPct = await ReportingPage.getSummaryNoMatchesPercentage()
    const matchesSum = Number((matchesPct + noMatchesPct).toFixed(2))
    expect(matchesSum).toBeGreaterThanOrEqual(95)
    expect(matchesSum).toBeLessThanOrEqual(101)

    const autoPct = await ReportingPage.getReleasesAutoSummaryPercentageValue()
    const manualPct =
      await ReportingPage.getReleasesManualSummaryPercentageValue()
    const releasesSum = Number((autoPct + manualPct).toFixed(2))
    expect(releasesSum).toBeGreaterThanOrEqual(95)
    expect(releasesSum).toBeLessThanOrEqual(101)

    const uniqueCount = await ReportingPage.getUniqueClearancesSummaryValue()
    const totalCount =
      await ReportingPage.getUniqueClearancesTotalSummaryValue()
    const uniquePct =
      await ReportingPage.getUniqueClearancesSummaryPercentageValue()

    if (totalCount > 0) {
      const expectedUniquePct = Number(
        ((uniqueCount / totalCount) * 100).toFixed(2)
      )
      const actualUniquePct = Number(uniquePct.toFixed(2))
      expect(actualUniquePct).toBe(expectedUniquePct)
    } else {
      expect(uniquePct).toBe(0)
    }

    const chedAPct = await ReportingPage.getChedASummaryPercentageValue()
    const chedPPct = await ReportingPage.getChedPSummaryPercentageValue()
    const chedPPPct = await ReportingPage.getChedPPSummaryPercentageValue()
    const chedDPct = await ReportingPage.getChedDSummaryPercentageValue()
    const chedSum = Number(
      (chedAPct + chedPPct + chedPPPct + chedDPct).toFixed(2)
    )
    expect(chedSum).toBeGreaterThanOrEqual(95)
    expect(chedSum).toBeLessThanOrEqual(101)
  })

  it('Should set a custom date range via date pickers and reflect in the results heading', async () => {
    await ReportingPage.openSummaryTab()
    // Compute start = 5 days ago, end = 1 day ago
    const now = new Date()
    const start = new Date(now)
    start.setDate(now.getDate() - 5)
    const end = new Date(now)
    end.setDate(now.getDate() - 1)

    const pad = (n) => String(n).padStart(2, '0')
    const toDdMmYyyy = (d) =>
      `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`
    const toLongDate = (d) =>
      `${d.getDate()} ${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`

    const startInput = toDdMmYyyy(start)
    const endInput = toDdMmYyyy(end)
    const startLong = toLongDate(start)
    const endLong = toLongDate(end)
    await ReportingPage.setDateRange(startInput, endInput)

    const headingText = await ReportingPage.filterResult()
    const normalised = headingText.replace(/\s+/g, ' ').trim()
    expect(normalised).toContain('Showing results from')
    expect(normalised).toContain(startLong)
    expect(normalised).toContain(endLong)
  })
})
