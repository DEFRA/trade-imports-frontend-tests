import { expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page.js'
import SearchPage from 'page-objects/search.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import {
  processorPostMatchedGmrFromFile,
  waitForDeclaration
} from '../utils/processorClient.js'
import {
  generateMrn,
  generateGmr,
  generateChed,
  generateCorrelationId
} from '../utils/id-generator.js'

describe('CDS Status on GMR and Search Results Page', () => {
  const gmrId = generateGmr()
  const mrns = Array.from({ length: 13 }, generateMrn)
  const cheds = Array.from({ length: 13 }, generateChed)

  // Each of these fixtures may have a:
  // -cr.xml - Clearance Request
  // -fin.xml - Finalisation
  // -ched.json - IPAFFS Ched
  // -gmr.json - GMR match result
  // Fixture 3 is missing for CR/Fins to simulate a GMR arriving but no matching records
  const fixtures = {
    0: '0-man-released',
    1: '1-released',
    2: '2-kings-warehouse',
    4: '4-seized',
    5: '5-destroyed',
    6: '6-awaiting-trader',
    7: '7-mss',
    8: '8-while-pre-loged',
    9: '9-awaiting-ipaff',
    10: '10-in-progress',
    11: '11-after-arrival',
    12: '12-awaiting-cds'
  }

  // 6 never gets a finalisation
  const finalisedIndices = [0, 1, 2, 4, 5, 7, 8, 11]

  // 6 never gets a CHED
  const chedIndices = [0, 1, 2, 4, 5, 7, 8, 9, 10, 11, 12]

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
    await processorPostMatchedGmrFromFile('../data/cds_status/0-gmr.json', {
      gmrId,
      customs: mrns.slice(0, 12),
      transits: [mrns[12]]
    })

    for (const [index, name] of Object.entries(fixtures)) {
      await sendCdsMessageFromFile(`../data/cds_status/${name}-cr.xml`, {
        mrn: mrns[index],
        correlationId: generateCorrelationId(),
        ched: cheds[index]
      })
    }

    for (const index of chedIndices) {
      await sendIpaffMessageFromFile(
        `../data/cds_status/${fixtures[index]}-ched.json`,
        { ched: cheds[index] }
      )
    }

    // Wait for all the clearance requests to be processed before submitting finalisations
    for (const index of Object.keys(fixtures)) {
      await waitForDeclaration(mrns[index])
    }

    for (const index of finalisedIndices) {
      await sendCdsMessageFromFile(
        `../data/cds_status/${fixtures[index]}-fin.xml`,
        { mrn: mrns[index], correlationId: generateCorrelationId() },
        true
      )
    }

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

  it('should display correct linked customs declaration details for a valid GMR', async () => {
    const mrnData = await GmrSearchResultsPage.getLinkedMrnData()
    const expectedRows = [
      {
        mrn: mrns[6],
        cdsStatus: 'In progress - Awaiting trader',
        btmsDecision: 'No match - CHED cannot be found',
        tagColor: statusColorMap['In progress - Awaiting trader']
      },
      {
        mrn: mrns[9],
        cdsStatus: 'In progress - Awaiting IPAFFS',
        btmsDecision: 'Hold - Decision not given',
        tagColor: statusColorMap['In progress - Awaiting IPAFFS']
      },
      {
        mrn: mrns[12],
        cdsStatus: 'In progress - Awaiting CDS',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['In progress - Awaiting CDS']
      },
      {
        mrn: mrns[10],
        cdsStatus: 'In progress',
        btmsDecision:
          'Data Error - Unexpected data - transit, transhipment or specific warehouse',
        tagColor: statusColorMap['In progress']
      },
      {
        mrn: mrns[0],
        cdsStatus: 'Finalised - Manually released',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['Finalised - Manually released']
      },
      {
        mrn: mrns[1],
        cdsStatus: 'Finalised - Released',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['Finalised - Released']
      },
      {
        mrn: mrns[11],
        cdsStatus: 'Finalised - Cancelled after arrival',
        btmsDecision: 'No match - CHED cancelled',
        tagColor: statusColorMap['Finalised - Cancelled after arrival']
      },
      {
        mrn: mrns[8],
        cdsStatus: 'Finalised - Cancelled while pre-lodged',
        btmsDecision: 'No match - CHED cancelled',
        tagColor: statusColorMap['Finalised - Cancelled while pre-lodged']
      },
      {
        mrn: mrns[5],
        cdsStatus: 'Finalised - Destroyed',
        btmsDecision: 'Refuse - Destroy',
        tagColor: statusColorMap['Finalised - Destroyed']
      },
      {
        mrn: mrns[4],
        cdsStatus: 'Finalised - Seized',
        btmsDecision: 'Refuse - Destroy',
        tagColor: statusColorMap['Finalised - Seized']
      },
      {
        mrn: mrns[2],
        cdsStatus: 'Finalised - Released to King’s warehouse',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['Finalised - Released to King’s warehouse']
      },
      {
        mrn: mrns[7],
        cdsStatus: 'Finalised - Transferred to MSS',
        btmsDecision: 'Release - Inspection complete T5 procedure',
        tagColor: statusColorMap['Finalised - Transferred to MSS']
      },
      {
        mrn: mrns[3],
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
    const targetMrn = mrns[0]
    const expectedStatus = 'Finalised - Manually released'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Released', async () => {
    const targetMrn = mrns[1]
    const expectedStatus = 'Finalised - Released'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Released to King’s warehouse', async () => {
    const targetMrn = mrns[2]
    const expectedStatus = 'Finalised - Released to King’s warehouse'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)

    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Seized', async () => {
    const targetMrn = mrns[4]
    const expectedStatus = 'Finalised - Seized'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Destroyed', async () => {
    const targetMrn = mrns[5]
    const expectedStatus = 'Finalised - Destroyed'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for In progress - Awaiting trader', async () => {
    const targetMrn = mrns[6]
    const expectedStatus = 'In progress - Awaiting trader'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Transferred to MSS', async () => {
    const targetMrn = mrns[7]
    const expectedStatus = 'Finalised - Transferred to MSS'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)

    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Cancelled while pre-lodged', async () => {
    const targetMrn = mrns[8]
    const expectedStatus = 'Finalised - Cancelled while pre-lodged'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for In progress - Awaiting IPAFFS', async () => {
    const targetMrn = mrns[9]
    const expectedStatus = 'In progress - Awaiting IPAFFS'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for In progress', async () => {
    const targetMrn = mrns[10]
    const expectedStatus = 'In progress'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for Finalised - Cancelled after arrival', async () => {
    const targetMrn = mrns[11]
    const expectedStatus = 'Finalised - Cancelled after arrival'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })

  it('should navigate to the correct customs declaration for In progress - Awaiting CDS', async () => {
    const targetMrn = mrns[12]
    const expectedStatus = 'In progress - Awaiting CDS'
    await GmrSearchResultsPage.open(gmrId)
    await GmrSearchResultsPage.clickLinkedMrn(targetMrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain(expectedStatus)
    expect(await SearchResultsPage.getCdsStatusTagColor()).toBe(
      statusColorMap[expectedStatus]
    )
    const displayedGmr = await SearchResultsPage.getGmrValue()
    await SearchResultsPage.clickGmrLink()
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${displayedGmr}`
    )
  })
})
