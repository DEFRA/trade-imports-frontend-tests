import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { processorPostMatchedGmrFromFile } from '../utils/processorClient.js'
import {
  generateMrn,
  generateGmr,
  generateChed,
  generateCorrelationId
} from '../utils/id-generator.js'

import HomePage from 'page-objects/home.page.js'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'
import SearchPage from 'page-objects/search.page.js'

describe('Accessibility Testing for GMR Page', () => {
  const gmrId = generateGmr()
  const mrn = generateMrn()
  const transitMrn = generateMrn()
  let ched

  before(async () => {
    ched = await generateChed()
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml', {
      mrn,
      ched,
      correlationId: generateCorrelationId()
    })
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr-1.xml', {
      mrn,
      ched,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json', { ched })
    await processorPostMatchedGmrFromFile('../data/gmr/gmr.json', {
      gmrId,
      customs: [mrn],
      transits: [transitMrn]
    })

    await initialiseAccessibilityChecking()
    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
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
