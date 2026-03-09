import {
  initialiseAccessibilityChecking,
  analyseAccessibility,
  generateAccessibilityReports,
  generateAccessibilityReportIndex
} from '../accessibility-checking.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import HomePage from '../page-objects/home.page.js'
import SearchPage from 'page-objects/search.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage'
import TimelinePage from '../page-objects/timeline.page.js'

describe('Accessibility Testing for Timeline Tab', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/timeline/1-cr-btms-error.xml')
    await sendCdsMessageFromFile('../data/timeline/2-cr.xml')
    await sendIpaffMessageFromFile('../data/timeline/3-ched-valid.json')
    await sendCdsMessageFromFile('../data/timeline/4-released-final.xml', true)
    await sendCdsMessageFromFile(
      '../data/timeline/5-cr-cds-error.xml',
      false,
      true
    )
    await sendIpaffMessageFromFile('../data/timeline/6-ched-valid.json')

    await initialiseAccessibilityChecking()
    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })
  it('Should check Timeline page for accessibility issues', async () => {
    const mrn = '24GBBGBKCDMA128014'
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
