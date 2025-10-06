import { expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page'
import SearchPage from '../page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendGmrMessageFromFile } from '../utils/gmrMessageHandler.js'

describe('GMR Search', () => {
  const gmrId = 'GMRA000000F8'

  before(async () => {
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml')
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json')
    await sendGmrMessageFromFile('../data/gmr/gmr.json')

    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })

  it('should display correct results when searching for a valid GMR', async () => {
    await SearchPage.open()
    await SearchPage.search(gmrId)
    const resultText = await SearchResultsPage.getResultText()
    expect(resultText).toContain(gmrId)
    // Add further assertions as needed to validate GMR-specific UI details
  })

  it('should show error message for an invalid GMR', async () => {
    const invalidGmr = 'GMRA000000XX'
    await SearchPage.open()
    await SearchPage.search(invalidGmr)
    expect(await SearchPage.getSearchErrorText()).toContain(
      `${invalidGmr} cannot be found`
    )
  })
})
