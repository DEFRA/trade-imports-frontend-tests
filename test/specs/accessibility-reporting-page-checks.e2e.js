import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page'
import ReportingPage from 'page-objects/reporting.page'

describe('Accessibility Testing', () => {
  before(async () => {
    await initialiseAccessibilityChecking()
    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })
  it('Should check Reporting page for accessibility issues', async () => {
    await ReportingPage.open()
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('reporting-tests')
    generateAccessibilityReportIndex()
  })
})
