import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page'
import SearchPage from 'page-objects/search.page'

describe('Accessibility Testing', () => {
  before(async () => {
    await initialiseAccessibilityChecking()
  })
  it('Should check Home page for accessibility issues', async () => {
    await HomePage.open()
    await analyseAccessibility()
  })
  it('Should check Search page for accessibility issues', async () => {
    await HomePage.login()
    await HomePage.loginRegisteredUser()
    await analyseAccessibility()
  })
  it('Should check Search Resuts page for accessibility issues', async () => {
    await SearchPage.search('24GBBGBKCDMS704600')
    await analyseAccessibility()
  })
  it('Should check Sign Out page for accessibility issues', async () => {
    await SearchPage.signout()
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('home-search-signout-tests')
    generateAccessibilityReportIndex()
  })
})
