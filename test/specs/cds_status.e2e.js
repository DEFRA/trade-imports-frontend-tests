import { expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendGmrMessageFromFile } from '../utils/gmrMessageHandler.js'

describe('GMR Search', () => {
  const gmrId = 'GMRA12280001'

  before(async () => {
    await sendGmrMessageFromFile('../data/cds_status/0-gmr.json')
    await sendCdsMessageFromFile('../data/cds_status/0-man-released-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/1-released-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/2-kings-warehouse-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/4-seized-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/5-destroyed-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/6-awaiting-trader-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/7-mss-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/8-while-pre-loged-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/9-awaiting-ipaff-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/10-in-progress-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/11-after-arrival-cr.xml')
    await sendCdsMessageFromFile('../data/cds_status/12-awaiting-cds-cr.xml')

    // Post CHEDS
    await sendIpaffMessageFromFile(
      '../data/cds_status/0-man-released-ched.json'
    )
    await sendIpaffMessageFromFile('../data/cds_status/1-released-ched.json')
    await sendIpaffMessageFromFile(
      '../data/cds_status/2-kings-warehouse-ched.json'
    )
    await sendIpaffMessageFromFile('../data/cds_status/7-mss-ched.json')
    await sendIpaffMessageFromFile(
      '../data/cds_status/9-awaiting-ipaff-ched.json'
    )
    await sendIpaffMessageFromFile(
      '../data/cds_status/10-in-progress-ched.json'
    )
    await sendIpaffMessageFromFile(
      '../data/cds_status/12-awaiting-cds-ched.json'
    )

    // POST Finalisations
    await sendCdsMessageFromFile(
      '../data/cds_status/0-man-released-fin.xml',
      true
    )
    await sendCdsMessageFromFile('../data/cds_status/1-released-fin.xml', true)
    await sendCdsMessageFromFile(
      '../data/cds_status/2-kings-warehouse-fin.xml',
      true
    )
    await sendCdsMessageFromFile('../data/cds_status/7-mss-fin.xml', true)

    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
  })

  it('should be able search for a valid GMR via Search Page', async () => {
    await SearchPage.search(gmrId)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${gmrId}`
    )
  })

  it.skip('should display correct linked customs declaration details for a valid GMR', async () => {
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

  it.skip('should navigate to the correct customs declaration when clicking a linked MRN', async () => {
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickFirstLinkedMrn()
    expect(await SearchResultsPage.getCdsStatus()).toContain(
      'In progress - Awaiting IPAFFS'
    )
  })
})
