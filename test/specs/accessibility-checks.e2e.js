import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page'

describe('Accessibility Testing', () => {
  it('Should check Home page for accessibility isues', async () => {
    await initialiseAccessibilityChecking()
    await HomePage.open()
    await analyseAccessibility()
    generateAccessibilityReports('home-page')
  })
  it('Should check Registered Users page for accessibility isues', async () => {
    await initialiseAccessibilityChecking()
    await HomePage.login()
    await HomePage.loginRegisteredUser()
    await analyseAccessibility()
    generateAccessibilityReports('home-page')
  })
})
