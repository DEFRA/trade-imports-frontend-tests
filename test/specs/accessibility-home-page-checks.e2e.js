import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'

import HomePage from 'page-objects/home.page'

describe('Accessibility Testing for Home Page', () => {
  before(async () => {
    await initialiseAccessibilityChecking()
  })
  it('Should check Home page for accessibility issues', async () => {
    await HomePage.open()
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('home-tests')
    generateAccessibilityReportIndex()
  })
})
