import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page'
import SearchPage from 'page-objects/search.page'

describe('Accessibility Testing for Signout Page', () => {
  before(async () => {
    await initialiseAccessibilityChecking()
    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })
  it('Should check Sign Out page for accessibility issues', async () => {
    await SearchPage.signout()
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('signout-tests')
    generateAccessibilityReportIndex()
  })
})
