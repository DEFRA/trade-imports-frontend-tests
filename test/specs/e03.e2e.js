import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page.js'
import SearchPage from '../page-objects/search.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'

describe('Search Results Page for E03', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/e03/e03.xml')
    await sendIpaffMessageFromFile('../data/e03/e03.json')

    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })
  it('Should assert on the CDS status for E03', async () => {
    const mrn = '24GBBGBKCDMS704712'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getCdsStatus()).toBe('In progress')
  })
})
