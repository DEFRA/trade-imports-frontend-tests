import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page.js'
import ReportingPage from 'page-objects/reporting.page.js'
import SearchPage from 'page-objects/search.page.js'

describe('Accessibility Testing for Reporting Page', () => {
  before(async () => {
    await initialiseAccessibilityChecking()
    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })
  it('Should check Reporting page for accessibility issues', async () => {
    await ReportingPage.open()
    await ReportingPage.lastMonthFilter()
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('reporting-tests')
    generateAccessibilityReportIndex()
  })
})
