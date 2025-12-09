import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page'
import SearchPage from 'page-objects/search.page'

describe('Accessibility Testing for Search Page', () => {
  before(async () => {
    await initialiseAccessibilityChecking()
    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })
  it('Should check Search page for accessibility issues', async () => {
    await analyseAccessibility()
  })
  it('Should check Search Resuts page for accessibility issues', async () => {
    await SearchPage.search('24GBBGBKCDMS704600')
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('search-tests')
    generateAccessibilityReportIndex()
  })
})
