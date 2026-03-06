import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'

describe('Timeline Search', () => {
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

    await HomePage.open()
    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })

  it('Should be able to sarch for a Valid MRN that has CDS Decision, BTMS Decision, CHED, CDS Finalisation, BTMS Error, and CDS Error', async () => {
    const mrn = '24GBBGBKCDMA128014'
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)
    // more steps and assertions
  })

  it('Should be able to sarch for a Valid MRN that has MRN dropdown', async () => {
    const mrn = '24GBBGBKCDMS135001'
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)
    // more steps and assertions
  })
})
