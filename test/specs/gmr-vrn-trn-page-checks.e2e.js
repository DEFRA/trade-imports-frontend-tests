import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendGmrMessageFromFile } from '../utils/gmrMessageHandler.js'

import HomePage from 'page-objects/home.page'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import VrnTrnSearchResultsPage from '../page-objects/vrn-trn-search-results-page.js'
import SearchPage from 'page-objects/search.page.js'

describe('Search Results Page for GMR Page and GMR Links', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml')
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr-1.xml')
    await sendCdsMessageFromFile('../data/gmr/1-clearance-gmr-customs.xml')
    await sendCdsMessageFromFile('../data/gmr/2-clearance-gmr-transit.xml')
    await sendCdsMessageFromFile('../data/gmr/3-clearance-gmr-customs-null.xml')
    await sendCdsMessageFromFile('../data/gmr/4-clearance-gmr-transit-null.xml')
    await sendCdsMessageFromFile(
      '../data/gmr/4-clearance-gmr-transit-null-2.xml'
    )
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json')
    await sendIpaffMessageFromFile('../data/gmr/1-ipaff-gmr-customs.json')
    await sendIpaffMessageFromFile('../data/gmr/2-ipaff-gmr-transit.json')
    await sendIpaffMessageFromFile('../data/gmr/3-ipaff-gmr-customs-null.json')
    await sendIpaffMessageFromFile('../data/gmr/4-ipaff-gmr-transit-null.json')
    await sendGmrMessageFromFile('../data/gmr/gmr.json')
    await sendGmrMessageFromFile('../data/gmr/1-gmr-empty-customs.json')
    await sendGmrMessageFromFile('../data/gmr/2-gmr-empty-transit.json')
    await sendGmrMessageFromFile('../data/gmr/3-gmr-null-customs.json')
    await sendGmrMessageFromFile('../data/gmr/4-gmr-null-transit.json')
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

  it('Should see GMR and MRN when customs is empty', async () => {
    const gmrId = 'GMRA11350002'
    const mrnId = '24GBBGBKCDMS135015'
    await SearchPage.open()
    await SearchPage.search(gmrId)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${gmrId}`
    )
    await GmrSearchResultsPage.clickLinkedMrn(mrnId)
    expect(await SearchResultsPage.getResultText()).toContain(mrnId)
  })

  it('Should see GMR and MRN when transit is empty', async () => {
    const gmrId = 'GMRA11350004'
    const mrnId = '24GBBGBKCDMS135016'
    await SearchPage.open()
    await SearchPage.search(gmrId)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${gmrId}`
    )
    await GmrSearchResultsPage.clickLinkedMrn(mrnId)
    expect(await SearchResultsPage.getResultText()).toContain(mrnId)
  })

  it('Should see GMR and MRN when customs is null', async () => {
    const gmrId = 'GMRA11350005'
    const mrnId = '24GBBGBKCDMS135017'
    await SearchPage.open()
    await SearchPage.search(gmrId)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${gmrId}`
    )
    await GmrSearchResultsPage.clickLinkedMrn(mrnId)
    expect(await SearchResultsPage.getResultText()).toContain(mrnId)
  })

  it('Should see GMR and MRN when transit is null', async () => {
    const gmrId = 'GMRA11350006'
    const mrnId = '24GBBGBKCDMS135018'
    await SearchPage.open()
    await SearchPage.search(gmrId)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${gmrId}`
    )
    await GmrSearchResultsPage.clickLinkedMrn(mrnId)
    expect(await SearchResultsPage.getResultText()).toContain(mrnId)
  })

  it('Should be able to search by VRN', async () => {
    const vrnId = 'DN05 VDB'
    await SearchPage.open()
    await SearchPage.search(vrnId)
    expect(await VrnTrnSearchResultsPage.getResultText()).toBe(
      `Showing result for\n${vrnId}`
    )
    expect(await VrnTrnSearchResultsPage.getPageTitleText()).toBe(
      `Showing result for ${vrnId} - Border Trade Matching Service`
    )
    expect(await VrnTrnSearchResultsPage.getLinkedGmrsHeaderText()).toBe(
      'Linked GMRs'
    )
  })

  it('Should be able to search by TRN', async () => {
    const trnId = 'YT08 NYD'
    await SearchPage.open()
    await SearchPage.search(trnId)
    expect(await VrnTrnSearchResultsPage.getResultText()).toBe(
      `Showing result for\n${trnId}`
    )
    expect(await VrnTrnSearchResultsPage.getPageTitleText()).toBe(
      `Showing result for ${trnId} - Border Trade Matching Service`
    )
    expect(await VrnTrnSearchResultsPage.getLinkedGmrsHeaderText()).toBe(
      'Linked GMRs'
    )
  })
})
