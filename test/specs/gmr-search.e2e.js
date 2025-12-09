import { expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendGmrMessageFromFile } from '../utils/gmrMessageHandler.js'

describe('GMR Search', () => {
  const gmrId = 'GMRA11350001'

  before(async () => {
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml')
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json')
    await sendGmrMessageFromFile('../data/gmr/gmr.json')

    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })

  it('should be able search for a valid GMR via Search Page', async () => {
    await SearchPage.search(gmrId)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${gmrId}`
    )
  })

  it('should display correct headings on the GMR results page', async () => {
    expect(await GmrSearchResultsPage.getPageTitle()).toBe(
      `Showing result for ${gmrId} - Border Trade Matching Service`
    )
    expect(await GmrSearchResultsPage.getVehicleDetailsHeading()).toBe(
      'Vehicle details'
    )
    expect(await GmrSearchResultsPage.getLinkedCustomsHeading()).toBe(
      'Linked customs declarations'
    )
  })

  it('should display correct vehicle details for a valid GMR', async () => {
    await GmrSearchResultsPage.open(gmrId)
    expect(await GmrSearchResultsPage.getVehicleRegistrationNumber()).toBe(
      'DN05 VDB'
    )
    expect(
      (await GmrSearchResultsPage.getTrailerRegistrationNumbers()).sort()
    ).toEqual(['V013 WKS', 'YT08 NYD'].sort())
  })

  it('should display correct linked customs declaration details for a valid GMR', async () => {
    const mrnData = await GmrSearchResultsPage.getLinkedMrnData()
    const expectedRows = [
      {
        mrn: '24GBBGBKCDMS135001',
        cdsStatus: 'In progress - Awaiting IPAFFS',
        btmsDecision: 'Hold - Decision not given'
      },
      {
        mrn: '24GBBGBKCDMS13500Z',
        cdsStatus: 'Unknown',
        btmsDecision: 'Unknown'
      }
    ]
    expect(mrnData.length).toBe(expectedRows.length)
    expectedRows.forEach((exp, idx) => {
      const actual = mrnData[idx]
      expect(actual.mrn).toBe(exp.mrn)
      expect(actual.cdsStatus).toBe(exp.cdsStatus)
      expect(actual.btmsDecision).toBe(exp.btmsDecision)
    })
  })

  it('should navigate to the correct customs declaration when clicking a linked MRN', async () => {
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickFirstLinkedMrn()
    expect(await SearchResultsPage.getCdsStatus()).toContain(
      'In progress - Awaiting IPAFFS'
    )
  })

  it('should show error message saying valid GMR not found', async () => {
    const invalidGmr = 'GMRA000000XX'
    await GmrSearchResultsPage.open(invalidGmr)
    expect(await SearchPage.getSearchErrorText()).toContain(
      `${invalidGmr} cannot be found`
    )
  })

  it('should show error message GMR format is not valid', async () => {
    const invalidGmr = 'GMR1000000XX'
    await GmrSearchResultsPage.open(invalidGmr)
    expect(await SearchPage.getSearchErrorText()).toContain(
      `Enter an MRN, CHED, GMR or DUCR reference in the correct format`
    )
  })
})
