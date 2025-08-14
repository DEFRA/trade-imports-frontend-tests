import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage'
import CustomDeclarationPage from '../page-objects/custom-declaration.page'
import ChedDeclarationPage from '../page-objects/ched-declaration.page'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'

describe('Search Results Page for Split Consignment', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/split-consignment.xml')
    await sendIpaffMessageFromFile('../data/split-consignment.json')
    await sendIpaffMessageFromFile('../data/split-consignmentV.json')
    await sendIpaffMessageFromFile('../data/split-consignmentR.json')

    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })
  it('Should be able to sarch for a Valid MRN and see IUU Checks', async () => {
    const mrn = '24GBBGBKCDMS895003'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)

    const customDeclarationCheds = [
      'CHEDPP.GB.2025.1010002',
      'CHEDPP.GB.2025.1010002V',
      'CHEDPP.GB.2025.1010002R'
    ]
    for (const ched of customDeclarationCheds) {
      expect(
        await CustomDeclarationPage.getAllText('24GBBGBKCDMS895003')
      ).toContain(ched)
    }

    const originalChedAndStatus = [
      'Partially rejected',
      'Rosa sp.',
      'Gypsophila sp.',
      'Hypericum sp.'
    ]
    for (const ched of originalChedAndStatus) {
      expect(
        await ChedDeclarationPage.getAllText('CHEDPP.GB.2025.1010002')
      ).toContain(ched)
    }

    const validChedAndStatus = ['Valid', 'Gypsophila sp.', 'Hypericum sp.']
    for (const ched of validChedAndStatus) {
      expect(
        await ChedDeclarationPage.getAllText('CHEDPP.GB.2025.1010002V')
      ).toContain(ched)
    }

    const rejectedChedAndStatus = ['Rejected', 'Rosa sp.']
    for (const ched of rejectedChedAndStatus) {
      expect(
        await ChedDeclarationPage.getAllText('CHEDPP.GB.2025.1010002R')
      ).toContain(ched)
    }
  })
})
