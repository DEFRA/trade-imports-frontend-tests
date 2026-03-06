import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'

import TimelinePage from '../page-objects/timeline.page.js'

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

    await TimelinePage.clickTimelineTab()
    await expect(await TimelinePage.timelineInfoMessage).toBeDisplayed()
    await expect(await TimelinePage.timelineInfoMessage.getText()).toContain(
      'The timeline includes events from the past 30 days only.'
    )

    const timelineTexts = await TimelinePage.allTimelineText()

    const expectedOrderForCdsDecision = [
      'CDS decision request',
      'CDS to BTMS',
      'Version',
      '3',
      'Created',
      '27 February 2026, 09:05:00'
    ]

    const expectedOrderForChed = [
      'CHEDA.GB.2025.1112814',
      'IPAFFS to BTMS',
      'CHED status',
      'VALIDATED',
      'Decision',
      'Horse Re-entry',
      'Created',
      '27 February 2026, 09:15:00'
    ]

    const expectedOrderForCdsFinalisation = [
      'CDS finalisation',
      'CDS to BTMS',
      'CDS status',
      'Finalised - Released',
      'Version',
      '3',
      'Created',
      '27 February 2026, 09:20:00'
    ]

    const expectedOrderForBtmsTrader = [
      'BTMS decision',
      'BTMS to CDS',
      'CDS status',
      'In progress - Awaiting trader',
      'Version',
      '1',
      'Created'
    ]

    const expectedOrderForBtmsCds = [
      'BTMS decision',
      'BTMS to CDS',
      'CDS status',
      'In progress - Awaiting CDS',
      'Version',
      '2',
      'Created'
    ]

    const expectedOrderForBtmsError = [
      'BTMS processing error',
      'BTMS to CDS',
      'Error',
      'ALVSVAL318',
      'Message',
      'Item 1 has no document code. BTMS requires at least one item document. Your request with correlation ID CDMA128014 has been terminated.',
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

  it('Should be able to sarch for a Valid MRN that has MRN dropdown', async () => {
    const mrn = '24GBBGBKCDMS135001'
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)

    await TimelinePage.clickTimelineTab()
    await expect(await TimelinePage.timelineInfoMessage).toBeDisplayed()
    await expect(await TimelinePage.timelineInfoMessage.getText()).toContain(
      'The timeline includes events from the past 30 days only.'
    )
    await expect(await TimelinePage.isTimelineMrnDropdownVisible()).toBe(true)
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
