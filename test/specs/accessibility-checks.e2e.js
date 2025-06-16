import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page'
import SearchPage from 'page-objects/search.page'

describe('Accessibility Testing', () => {
  it('Should check Home page for accessibility issues', async () => {
    await initialiseAccessibilityChecking()
    await HomePage.open()
    await analyseAccessibility()
    generateAccessibilityReports('home-page')
  })
  it('Should check Search page for accessibility issues', async () => {
    await initialiseAccessibilityChecking()
    await HomePage.login()
    await HomePage.loginRegisteredUser()
    await analyseAccessibility()
    generateAccessibilityReports('home-page')
  })
  it('Should check Search Resuts page for accessibility issues', async () => {
    await initialiseAccessibilityChecking()
    await SearchPage.search('24GBBGBKCDMS704600')
    await analyseAccessibility()
    generateAccessibilityReports('home-page')
  })
})
