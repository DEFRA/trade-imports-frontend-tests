import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page'
import SearchPage from 'page-objects/search.page.js'

describe('Accessibility Testing for Home Page', () => {
  before(async () => {
    await initialiseAccessibilityChecking()
  })
  it('Should check Home page for accessibility issues', async () => {
    await HomePage.open()

    if (await SearchPage.sessionActive()) {
      await SearchPage.signout()
      await HomePage.open()
    }

    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('home-tests')
    generateAccessibilityReportIndex()
  })
})
