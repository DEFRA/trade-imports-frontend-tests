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

  const statusColorMap = {
    'In progress - Awaiting trader': 'yellow',
    'In progress - Awaiting IPAFFS': 'yellow',
    'In progress - Awaiting CDS': 'yellow',
    'In progress': 'yellow',
    'Finalised - Manually released': 'green',
    'Finalised - Released': 'green',
    'Finalised - Cancelled after arrival': 'red',
    'Finalised - Cancelled while pre-lodged': 'red',
    'Finalised - Destroyed': 'red',
    'Finalised - Seized': 'red',
    Unknown: 'gray'
  }

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
    await sendIpaffMessageFromFile('../data/cds_status/4-seized-ched.json')
    await sendIpaffMessageFromFile('../data/cds_status/5-destroyed-ched.json')
    await sendIpaffMessageFromFile('../data/cds_status/7-mss-ched.json')
    await sendIpaffMessageFromFile(
      '../data/cds_status/8-while-pre-loged-ched.json'
    )
    await sendIpaffMessageFromFile(
      '../data/cds_status/9-awaiting-ipaff-ched.json'
    )
    await sendIpaffMessageFromFile(
      '../data/cds_status/10-in-progress-ched.json'
    )
    await sendIpaffMessageFromFile(
      '../data/cds_status/11-after-arrival-ched.json'
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
    await sendCdsMessageFromFile('../data/cds_status/4-seized-fin.xml', true)
    await sendCdsMessageFromFile('../data/cds_status/5-destroyed-fin.xml', true)
    await sendCdsMessageFromFile('../data/cds_status/7-mss-fin.xml', true)
    await sendCdsMessageFromFile(
      '../data/cds_status/8-while-pre-loged-fin.xml',
      true
    )
    await sendCdsMessageFromFile(
      '../data/cds_status/11-after-arrival-fin.xml',
      true
    )

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

  it('should display correct linked customs declaration details for a valid GMR', async () => {
    const mrnData = await GmrSearchResultsPage.getLinkedMrnData()
    const expectedRows = [
      {
        mrn: '24GBBGBKCDMS128006',
        cdsStatus: 'In progress - Awaiting trader',
        btmsDecision: 'No match - CHED cannot be found',
        tagColor: statusColorMap['In progress - Awaiting trader']
      },
      {
        mrn: '24GBBGBKCDMS128009',
        cdsStatus: 'In progress - Awaiting IPAFFS',
        btmsDecision: 'Hold - Decision not given',
        tagColor: statusColorMap['In progress - Awaiting IPAFFS']
      },
      {
        mrn: '24GBBGBKCDMS128012',
        cdsStatus: 'In progress - Awaiting CDS',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['In progress - Awaiting CDS']
      },
      {
        mrn: '24GBBGBKCDMS128010',
        cdsStatus: 'In progress',
        btmsDecision:
          'Data Error - Unexpected data - transit, transhipment or specific warehouse',
        tagColor: statusColorMap['In progress']
      },
      {
        mrn: '24GBBGBKCDMS128000',
        cdsStatus: 'Finalised - Manually released',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['Finalised - Manually released']
      },
      {
        mrn: '24GBBGBKCDMS128001',
        cdsStatus: 'Finalised - Released',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['Finalised - Released']
      },
      {
        mrn: '24GBBGBKCDMS128011',
        cdsStatus: 'Finalised - Cancelled after arrival',
        btmsDecision: 'No match - CHED cancelled',
        tagColor: statusColorMap['Finalised - Cancelled after arrival']
      },
      {
        mrn: '24GBBGBKCDMS128008',
        cdsStatus: 'Finalised - Cancelled while pre-lodged',
        btmsDecision: 'No match - CHED cancelled',
        tagColor: statusColorMap['Finalised - Cancelled while pre-lodged']
      },
      {
        mrn: '24GBBGBKCDMS128005',
        cdsStatus: 'Finalised - Destroyed',
        btmsDecision: 'Refuse - Destroy',
        tagColor: statusColorMap['Finalised - Destroyed']
      },
      {
        mrn: '24GBBGBKCDMS128004',
        cdsStatus: 'Finalised - Seized',
        btmsDecision: 'Refuse - Destroy',
        tagColor: statusColorMap['Finalised - Seized']
      },
      {
        mrn: '24GBBGBKCDMS128002',
        cdsStatus: 'Finalised - Released to King’s warehouse',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['Finalised - Released to King’s warehouse']
      },
      {
        mrn: '24GBBGBKCDMS128007',
        cdsStatus: 'Finalised - Transferred to MSS',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['Finalised - Transferred to MSS']
      },
      {
        mrn: '24GBBGBKCDMS128003',
        cdsStatus: 'Unknown',
        btmsDecision: 'Unknown',
        tagColor: statusColorMap.Unknown
      }
    ]
    expect(mrnData.length).toBe(expectedRows.length)
    expectedRows.forEach((exp, idx) => {
      const actual = mrnData[idx]
      expect(actual.mrn).toBe(exp.mrn)
      expect(actual.cdsStatus).toBe(exp.cdsStatus)
      expect(actual.btmsDecision).toBe(exp.btmsDecision)
      expect(statusColorMap[exp.cdsStatus]).toBe(exp.tagColor)
    })
  })

  it('should navigate to the correct customs declaration for Finalised - Manually released', async () => {
    const targetMrn = '24GBBGBKCDMS128000'
    const expectedStatus = 'Finalised - Manually released'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Released', async () => {
    const targetMrn = '24GBBGBKCDMS128001'
    const expectedStatus = 'Finalised - Released'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Released to King’s warehouse', async () => {
    const targetMrn = '24GBBGBKCDMS128002'
    const expectedStatus = 'Finalised - Released to King’s warehouse'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
  })

  it('should navigate to the correct customs declaration for Finalised - Seized', async () => {
    const targetMrn = '24GBBGBKCDMS128004'
    const expectedStatus = 'Finalised - Seized'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Destroyed', async () => {
    const targetMrn = '24GBBGBKCDMS128005'
    const expectedStatus = 'Finalised - Destroyed'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })

  it('should navigate to the correct customs declaration for In progress - Awaiting trader', async () => {
    const targetMrn = '24GBBGBKCDMS128006'
    const expectedStatus = 'In progress - Awaiting trader'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Transferred to MSS', async () => {
    const targetMrn = '24GBBGBKCDMS128007'
    const expectedStatus = 'Finalised - Transferred to MSS'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
  })

  it('should navigate to the correct customs declaration for Finalised - Cancelled while pre-lodged', async () => {
    const targetMrn = '24GBBGBKCDMS128008'
    const expectedStatus = 'Finalised - Cancelled while pre-lodged'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })

  it('should navigate to the correct customs declaration for In progress - Awaiting IPAFFS', async () => {
    const targetMrn = '24GBBGBKCDMS128009'
    const expectedStatus = 'In progress - Awaiting IPAFFS'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })

  it('should navigate to the correct customs declaration for In progress', async () => {
    const targetMrn = '24GBBGBKCDMS128010'
    const expectedStatus = 'In progress'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Cancelled after arrival', async () => {
    const targetMrn = '24GBBGBKCDMS128011'
    const expectedStatus = 'Finalised - Cancelled after arrival'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })

  it('should navigate to the correct customs declaration for In progress - Awaiting CDS', async () => {
    const targetMrn = '24GBBGBKCDMS128012'
    const expectedStatus = 'In progress - Awaiting CDS'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
  })
})
