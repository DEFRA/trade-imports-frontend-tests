import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import {
  generateMrn,
  generateChed,
  generateCorrelationId
} from '../utils/id-generator.js'
import HomePage from '../page-objects/home.page.js'
import SearchPage from 'page-objects/search.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import TimelinePage from '../page-objects/timeline.page.js'

describe('Accessibility Testing for Timeline Tab', () => {
  const mrn = generateMrn()
  let ched
  const correlationId = generateCorrelationId()

  before(async () => {
    ched = await generateChed()
    await sendCdsMessageFromFile('../data/timeline/1-cr-btms-error.xml', {
      mrn,
      correlationId
    })
    await sendCdsMessageFromFile('../data/timeline/2-cr.xml', {
      mrn,
      ched,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/timeline/3-ched-valid.json', {
      ched
    })
    await sendCdsMessageFromFile(
      '../data/timeline/4-released-final.xml',
      { mrn, correlationId: generateCorrelationId() },
      true
    )
    await sendCdsMessageFromFile(
      '../data/timeline/5-cr-cds-error.xml',
      { mrn, correlationId: generateCorrelationId() },
      false,
      true
    )
    await sendIpaffMessageFromFile('../data/timeline/6-ched-valid.json', {
      ched
    })

    await initialiseAccessibilityChecking()
    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })
  it('Should check Timeline page for accessibility issues', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)

    await TimelinePage.clickTimelineTab()
    await analyseAccessibility()
  })
  after(async () => {
    generateAccessibilityReports('timeline-tests')
    generateAccessibilityReportIndex()
  })
})
