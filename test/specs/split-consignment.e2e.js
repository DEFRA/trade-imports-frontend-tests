import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'

describe('Search Results Page', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/split-consignment.xml')
    await sendIpaffMessageFromFile('../data/split-consignment.json')
    await sendIpaffMessageFromFile('../data/split-consignmentV.json')
    await sendIpaffMessageFromFile('../data/split-consignmentR.json')

    await HomePage.open()
    await HomePage.login()
    await HomePage.loginRegisteredUser()
  })
  it('Should be able to sarch for a Valid MRN and see IUU Checks', async () => {
    const mrn = '24GBBGBKCDMS895002'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)
    // Assert on Custom Declarationa and CHED IUU
  })
})
