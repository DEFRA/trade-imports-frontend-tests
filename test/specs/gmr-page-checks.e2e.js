import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendGmrMessageFromFile } from '../utils/gmrMessageHandler.js'

import HomePage from 'page-objects/home.page'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import SearchPage from 'page-objects/search.page.js'

describe('Search Results Page for GMR Page and GMR Links', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml')
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr-1.xml')
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json')
    await sendGmrMessageFromFile('../data/gmr/gmr.json')
    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })
  it('Should check GMR link visibility', async () => {
    const mrn = '24GBBGBKCDMS135001'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)
  })

  it('Should show GMR link for MRN 24GBBGBKCDMS135001', async () => {
    expect(
      await SearchResultsPage.isGmrLinkDisplayedForMrn('24GBBGBKCDMS135001')
    ).toBe(true)
  })

  it('Should not show GMR link for MRN 24GBBGBKCDMS135014', async () => {
    expect(
      await SearchResultsPage.isGmrLinkDisplayedForMrn('24GBBGBKCDMS135014')
    ).toBe(false)
  })
})
