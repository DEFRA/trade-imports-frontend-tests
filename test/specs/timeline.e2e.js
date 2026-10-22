import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page.js'
import SearchPage from 'page-objects/search.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import TimelinePage from '../page-objects/timeline.page.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { processorPostMatchedGmrFromFile } from '../utils/processorClient.js'
import {
  generateMrn,
  generateGmr,
  generateChed,
  generateCorrelationId,
  convertChedForIpaff
} from '../utils/id-generator.js'

describe('Timeline Search', () => {
  const mrn = generateMrn()
  let ched
  const correlationId = generateCorrelationId()

  const dropdownMrn = generateMrn()
  const dropdownMrn2 = generateMrn()
  const dropdownMrn3 = generateMrn()
  const dropdownGmr = generateGmr()
  let dropdownChed

  before(async () => {
    const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
    ched = await generateChed()
    dropdownChed = await generateChed()
    await sendCdsMessageFromFile('../data/timeline/1-cr-btms-error.xml', {
      mrn,
      correlationId
    })
    await pause(2000)
    await sendCdsMessageFromFile('../data/timeline/2-cr.xml', {
      mrn,
      ched: convertChedForIpaff(ched),
      correlationId: generateCorrelationId()
    })
    await pause(2000)
    await sendIpaffMessageFromFile('../data/timeline/3-ched-valid.json', {
      ched
    })
    await pause(2000)
    await sendCdsMessageFromFile(
      '../data/timeline/4-released-final.xml',
      { mrn, correlationId: generateCorrelationId() },
      true
    )
    await pause(2000)
    await sendCdsMessageFromFile(
      '../data/timeline/5-cr-cds-error.xml',
      { mrn, correlationId: generateCorrelationId() },
      false,
      true
    )
    await pause(2000)
    await sendIpaffMessageFromFile('../data/timeline/6-ched-valid.json', {
      ched
    })
    await pause(2000)

    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml', {
      mrn: dropdownMrn,
      ched: dropdownChed,
      correlationId: generateCorrelationId()
    })
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr-1.xml', {
      mrn: dropdownMrn2,
      ched: dropdownChed,
      correlationId: generateCorrelationId()
    })
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr-2.xml', {
      mrn: dropdownMrn3,
      ched: dropdownChed,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json', {
      ched: dropdownChed
    })
    await processorPostMatchedGmrFromFile('../data/gmr/gmr.json', {
      gmrId: dropdownGmr,
      customs: [dropdownMrn],
      transits: [generateMrn()]
    })
    await pause(2000)

    await HomePage.open()
    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })

  it('Should be able to search for a Valid MRN that has CDS Decision, BTMS Decision, CHED, CDS Finalisation, BTMS Error, and CDS Error', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)

    await TimelinePage.clickTimelineTab()
    expect(await TimelinePage.getTimelineInfoMessage()).toContain(
      'The timeline includes events from the past 180 days only.'
    )

    const timelineTexts = await TimelinePage.allTimelineText(mrn)

    const expectedOrderForCdsDecision = [
      'CDS clearance request',
      'CDS to BTMS',
      'External version',
      '3',
      'Created'
    ]

    const expectedOrderForChed = [
      ched,
      'IPAFFS to BTMS',
      'CHED status',
      'VALIDATED',
      'Decision',
      'Horse Re-entry',
      'Created'
    ]

    const expectedOrderForCdsFinalisation = [
      'CDS finalisation',
      'CDS to BTMS',
      'CDS status',
      'Finalised - Released',
      'Version',
      '3',
      'Created'
    ]

    const expectedOrderForBtmsTrader = [
      'BTMS decision',
      'BTMS to CDS',
      'CDS status',
      'In progress - Awaiting trader',
      'Decision number',
      '1',
      'External version',
      '3',
      'Created'
    ]

    const expectedOrderForBtmsCds = [
      'BTMS decision',
      'BTMS to CDS',
      'CDS status',
      'In progress - Awaiting CDS',
      'Decision number',
      '2',
      'External version',
      '3',
      'Created'
    ]

    const expectedOrderForBtmsError = [
      'BTMS processing error',
      'BTMS to CDS',
      'Error',
      'ALVSVAL318',
      'Message',
      `Item 1 has no document code. BTMS requires at least one item document. Your request with correlation ID ${correlationId} has been terminated.`,
      'Created'
    ]

    const expectedOrderForCdsError = [
      'CDS processing error',
      'CDS to BTMS',
      'Error',
      'HMRCVAL101',
      'Message',
      'The EntryReference was not recognised. HMRC is unable to process the decision notification {{TICKET}}{{ITERATION}}.',
      'Created'
    ]

    expectConsecutiveSubsequence(timelineTexts, expectedOrderForCdsDecision)
    expectConsecutiveSubsequence(timelineTexts, expectedOrderForChed)
    expectConsecutiveSubsequence(timelineTexts, expectedOrderForCdsFinalisation)
    expectConsecutiveSubsequence(timelineTexts, expectedOrderForBtmsTrader)
    expectConsecutiveSubsequence(timelineTexts, expectedOrderForBtmsCds)
    expectConsecutiveSubsequence(timelineTexts, expectedOrderForBtmsError)
    expectConsecutiveSubsequence(timelineTexts, expectedOrderForCdsError)

    await expect(await TimelinePage.isTimelineMrnDropdownVisible()).toBe(false)
  })

  it('Should be able to search for a Valid MRN that has MRN dropdown', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(dropdownMrn)
    expect(await SearchResultsPage.getResultText()).toContain(dropdownMrn)

    await TimelinePage.clickTimelineTab()
    expect(await TimelinePage.getTimelineInfoMessage()).toContain(
      'The timeline includes events from the past 180 days only.'
    )
    await expect(await TimelinePage.isTimelineMrnDropdownVisible()).toBe(true)

    const timelineTexts = await TimelinePage.allTimelineText(dropdownMrn)

    const expectedOrderForCdsDecision = [
      'CDS clearance request',
      'CDS to BTMS',
      'External version',
      '3',
      'Created'
    ]

    const expectedOrderForChed = [
      dropdownChed,
      'IPAFFS to BTMS',
      'CHED status',
      'SUBMITTED',
      'Created'
    ]

    const expectedOrderForBtmsTrader = [
      'BTMS decision',
      'BTMS to CDS',
      'CDS status',
      'In progress - Awaiting trader',
      'Decision number',
      '1',
      'External version',
      '3',
      'Created'
    ]

    const expectedOrderForBtmsIpaffs = [
      'BTMS decision',
      'BTMS to CDS',
      'CDS status',
      'In progress - Awaiting IPAFFS',
      'Decision number',
      '2',
      'External version',
      '3',
      'Created'
    ]

    expectConsecutiveSubsequence(timelineTexts, expectedOrderForCdsDecision)
    expectConsecutiveSubsequence(timelineTexts, expectedOrderForChed)
    expectConsecutiveSubsequence(timelineTexts, expectedOrderForBtmsTrader)
    expectConsecutiveSubsequence(timelineTexts, expectedOrderForBtmsIpaffs)

    await TimelinePage.selectDropdownAndClickVisibleMoreDetails(dropdownMrn)

    const timelineExpandedTexts =
      await TimelinePage.allTimelineText(dropdownMrn)

    const expectedTextForFirstMrn = [
      `Item 1 - SALSICCIA PURO SUINO ${dropdownMrn}`
    ]
    expectConsecutiveSubsequence(timelineExpandedTexts, expectedTextForFirstMrn)

    await SearchPage.clickNavSearchLink()
    await SearchPage.search(dropdownMrn2)
    expect(await SearchResultsPage.getResultText()).toContain(dropdownMrn2)

    await TimelinePage.clickTimelineTab()
    expect(await TimelinePage.getTimelineInfoMessage()).toContain(
      'The timeline includes events from the past 180 days only.'
    )
    await expect(await TimelinePage.isTimelineMrnDropdownVisible()).toBe(true)

    await TimelinePage.selectDropdownAndClickVisibleMoreDetails(dropdownMrn2)
    const timelineTexts2 = await TimelinePage.allTimelineText(dropdownMrn2)

    const expectedTextForFirstMrn2 = [
      `Item 1 - SALSICCIA PURO SUINO ${dropdownMrn2}`
    ]
    expectConsecutiveSubsequence(timelineTexts2, expectedTextForFirstMrn2)
  })

  it('Should be able to search for a Valid MRN and apply Custom Declaration filters', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(dropdownMrn)
    expect(await SearchResultsPage.getResultText()).toContain(dropdownMrn)

    await SearchPage.clickLatestTab()
    const initialVisibleDeclarationRowsCount =
      await SearchPage.visibleDeclarationRowsCount()
    expect(initialVisibleDeclarationRowsCount).toBeGreaterThan(0)

    await SearchPage.selectDeclarationMatchFilter('No')
    expect(await SearchPage.getDeclarationNoItemsMessage()).toContain(
      'There are no items that match the filters selected.'
    )
    expect(await SearchPage.visibleDeclarationRowsCount()).toBe(0)

    await SearchPage.selectDeclarationMatchFilter('Show all')
    await expect(await SearchPage.visibleDeclarationRowsCount()).toBe(
      initialVisibleDeclarationRowsCount
    )
  })

  it('Should be able to search for a Valid MRN and apply IPAFF filters', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(dropdownMrn)
    expect(await SearchResultsPage.getResultText()).toContain(dropdownMrn)

    await SearchPage.clickLatestTab()
    const initialVisibleNotificationRowsCount =
      await SearchPage.visibleNotificationRowsCount()
    expect(initialVisibleNotificationRowsCount).toBeGreaterThan(0)

    await SearchPage.selectNotificationAuthorityFilter('POAO')
    expect(await SearchPage.getNotificationNoItemsMessage()).toContain(
      'There are no commodities that match the filters selected.'
    )
    expect(await SearchPage.visibleNotificationRowsCount()).toBe(0)

    await SearchPage.selectNotificationAuthorityFilter('Show all')
    await expect(await SearchPage.visibleNotificationRowsCount()).toBe(
      initialVisibleNotificationRowsCount
    )
  })
})

function expectConsecutiveSubsequence(arr, subseq) {
  for (let i = 0; i <= arr.length - subseq.length; i++) {
    let match = true
    for (let j = 0; j < subseq.length; j++) {
      if (arr[i + j] !== subseq[j]) {
        match = false
        break
      }
    }
    if (match) return
  }
  throw new Error(
    `Expected consecutive sequence not found.\nExpected: ${JSON.stringify(subseq)}\nActual: ${JSON.stringify(arr)}`
  )
}
