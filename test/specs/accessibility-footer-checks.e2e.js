import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'

import HomePage from '../page-objects/home.page'
import FooterPage from 'page-objects/footer.page.js'

describe('Accessibility Testing for Footer Tests', () => {
  before(async () => {
    await initialiseAccessibilityChecking()
    await HomePage.open()
  })
  it('Should check Cookies page for accessibility issues', async () => {
    await FooterPage.clickCookies()
    await analyseAccessibility()
  })
  it('Should check Accessibility page for accessibility issues', async () => {
    await FooterPage.clickAccessibility()
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('footer-tests')
    generateAccessibilityReportIndex()
  })
})
