import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page.js'
import SearchPage from '../page-objects/search.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import CustomDeclaration from '../page-objects/custom-declaration.page.js'
import chedDeclarationPage from '../page-objects/ched-declaration.page.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'

describe('Search Results Page for IUU', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/iuu/iuu.xml')
    await sendIpaffMessageFromFile('../data/iuu/iuu.json')

    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })
  it('Should be able to sarch for a Valid MRN and see IUU Checks', async () => {
    const mrn = '24GBBGBKCDMS836027'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)
    expect(await CustomDeclaration.getIuuDataAuthroty()).toContain(
      'Release - IUU inspection complete (IUU)'
    )
    expect(await chedDeclarationPage.getIuuDataAuthroty()).toContain(
      'IUU inspection complete (IUU)'
    )
  })
})
