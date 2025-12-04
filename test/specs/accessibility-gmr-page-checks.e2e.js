import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendGmrMessageFromFile } from '../utils/gmrMessageHandler.js'

import HomePage from 'page-objects/home.page'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'

describe('Accessibility Testing for GMR Page', () => {
  const gmrId = 'GMRA11350001'

  before(async () => {
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml')
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json')
    await sendGmrMessageFromFile('../data/gmr/gmr.json')

    await initialiseAccessibilityChecking()
    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })
  it('Should check GMR page for accessibility issues', async () => {
    await GmrSearchResultsPage.open(gmrId)
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('gmr-tests')
    generateAccessibilityReportIndex()
  })
})
