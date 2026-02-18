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
import SearchPage from 'page-objects/search.page.js'

describe('Accessibility Testing for VRN and TRN Page', () => {
  const vrnId = 'DN05 VDB'

  before(async () => {
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml')
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr-1.xml')
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json')
    await sendGmrMessageFromFile('../data/gmr/gmr.json')

    await initialiseAccessibilityChecking()
    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })
  it('Should check GMR page for accessibility issues', async () => {
    await SearchPage.open()
    await SearchPage.search(vrnId)
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('vrn-trn-tests')
    generateAccessibilityReportIndex()
  })
})
