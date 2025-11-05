import { expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendGmrMessageFromFile } from '../utils/gmrMessageHandler.js'

describe('GMR Search', () => {
  const gmrId = 'GMRA10000003'

  before(async () => {
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml')
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json')
    await sendGmrMessageFromFile('../data/gmr/gmr.json')

    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })

  it('should display correct results when navigating directly to a valid GMR results page', async () => {
    await GmrSearchResultsPage.open(gmrId)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(gmrId)
    expect(await GmrSearchResultsPage.getPageTitle()).toBe(
      `Showing result for ${gmrId} - Border Trade Matching Service`
    )
    expect(await GmrSearchResultsPage.getVehicleDetailsHeading()).toBe(
      'Vehicle details'
    )
    expect(await GmrSearchResultsPage.getVehicleRegistrationNumber()).toBe(
      'DN05 VDB'
    )
    expect(
      (await GmrSearchResultsPage.getTrailerRegistrationNumbers()).sort()
    ).toEqual(['V013 WKS', 'YT08 NYD'].sort())

    expect(await GmrSearchResultsPage.getLinkedCustomsHeading()).toBe(
      'Linked customs declarations'
    )
    const rows = await GmrSearchResultsPage.getLinkedCustomsRows()
    expect(rows.length).toBeGreaterThan(0)
  })

  it('should show no linked customs rows for an invalid GMR', async () => {
    const invalidGmr = 'GMRA000000XX'
    await GmrSearchResultsPage.open(invalidGmr)
    expect(await SearchPage.getSearchErrorText()).toContain(
      `${invalidGmr} cannot be found`
    )
  })
})
