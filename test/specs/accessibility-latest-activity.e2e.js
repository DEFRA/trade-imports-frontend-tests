import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page'
import LatestActivityPage from '../page-objects/latest-activity.page'

describe('Accessibility Testing', () => {
  before(async () => {
    await initialiseAccessibilityChecking()
    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })
  it('Should check Latest Activity page for accessibility issues', async () => {
    await LatestActivityPage.open()
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('latest-activity-tests')
    generateAccessibilityReportIndex()
  })
})
