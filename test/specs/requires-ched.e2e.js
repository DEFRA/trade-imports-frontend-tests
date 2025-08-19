import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'

describe.skip('Search Results Page for Requires CHED', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/requires-ched/requires-ched.xml')

    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })
  it('Should be able to sarch for a Valid MRN and see Replace CHED status', async () => {
    const mrn = '25GBAZ34DF56882007'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)
    expect(await SearchResultsPage.customDeclarationAllResultText()).toContain(
      'Requires CHED'
    )
  })
})
