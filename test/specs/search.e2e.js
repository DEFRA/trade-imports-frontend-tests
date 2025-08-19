import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage'
import CustomDeclarationPage from '../page-objects/custom-declaration.page'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'

describe('Search page', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/search/cds.xml')
    await sendIpaffMessageFromFile('../data/search/ipaff.json')

    await SearchPage.open() // Testing Redirection
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })
  it('Should be able to sarch for a Valid MRN', async () => {
    const mrn = '24GBBGBKCDMS704608'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)
  })
  it('Should be able to sarch for a Valid CHED', async () => {
    const ched = 'CHEDA.GB.2025.1004608'
    await SearchPage.open()
    await SearchPage.search(ched)
    expect(await SearchResultsPage.getResultText()).toContain(ched)

    const customDeclarationCheds = ['CHED Status', 'New']
    for (const ched of customDeclarationCheds) {
      expect(
        await CustomDeclarationPage.getAllText('CHEDA.GB.2025.1004608')
      ).toContain(ched)
    }
  })
  it('Should be able to sarch for a Valid DUCR', async () => {
    const ducr = '4GB269573944000-PORTACDMS704608'
    await SearchPage.open()
    await SearchPage.search(ducr)
    expect(await SearchResultsPage.getResultText()).toContain(ducr)
  })
  it('Should see error message when results not found for MRN', async () => {
    await SearchPage.open()
    await SearchPage.search('24GBBGBKCDMS704000')
    expect(await SearchPage.getSearchErrorText()).toContain(
      '24GBBGBKCDMS704000 cannot be found'
    )
  })
  it('Should see error message when results not found for CHED', async () => {
    await SearchPage.open()
    await SearchPage.search('CHEDA.GB.2025.1704000')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'CHEDA.GB.2025.1704000 cannot be found'
    )
  })
  it('Should see error message when results not found for DUCR', async () => {
    await SearchPage.open()
    await SearchPage.search('4GB269573944000-PORTACDMS704000')
    expect(await SearchPage.getSearchErrorText()).toContain(
      '4GB269573944000-PORTACDMS704000 cannot be found'
    )
  })
  it('Should see error message when invalid search term provided', async () => {
    await SearchPage.open()
    await SearchPage.search('bad search term')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'Enter an MRN, CHED or DUCR reference in the correct format'
    )
  })
  it('Should see error message when searching for empty search term', async () => {
    await SearchPage.open()
    await SearchPage.search('')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'Enter an MRN, CHED or DUCR'
    )
  })
})
