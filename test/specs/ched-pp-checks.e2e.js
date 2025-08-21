import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage'
import CustomDeclarationPage from '../page-objects/custom-declaration.page'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'

describe('Search Results Page for CHED-PP', () => {
  before(async () => {
    await sendCdsMessageFromFile(
      '../data/CHED-PP/C085_check/clearance-request.xml'
    )
    await sendIpaffMessageFromFile('../data/CHED-PP/C085_check/9115-ched.json')
    await sendIpaffMessageFromFile('../data/CHED-PP/C085_check/CO85-ched.json')
    await sendIpaffMessageFromFile('../data/CHED-PP/C085_check/N851-ched.json')

    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })
  it('Should be able to sarch for a Valid MRN and see CHED-PP Document References', async () => {
    const mrn = '24GBBGBKCDMS965012'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)

    const customDeclarationCheds = [
      'CHEDPP.GB.2025.1005020',
      'CHEDPP.GB.2025.1005021',
      'CHEDPP.GB.2025.1005022'
    ]
    for (const ched of customDeclarationCheds) {
      expect(
        await CustomDeclarationPage.getAllText('24GBBGBKCDMS965012')
      ).toContain(ched)
    }
  })
})
