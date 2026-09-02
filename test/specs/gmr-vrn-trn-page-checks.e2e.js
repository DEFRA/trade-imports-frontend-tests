import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { processorPostMatchedGmrFromFile } from '../utils/processorClient.js'
import {
  generateMrn,
  generateGmr,
  generateChed,
  generateVrn,
  generateTrn,
  generateCorrelationId
} from '../utils/id-generator.js'

import HomePage from 'page-objects/home.page.js'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import VrnTrnSearchResultsPage from '../page-objects/vrn-trn-search-results-page.js'
import SearchPage from 'page-objects/search.page.js'

describe('Search Results Page for GMR, VRN and TRN Page', () => {
  const vrn = generateVrn()
  const trn = generateTrn()

  const customsMrn = generateMrn()
  const transitMrn = generateMrn()
  const mainGmrId = generateGmr()
  let mainChed

  const gmr2Mrn = generateMrn()
  let gmr2Ched

  const customsEmptyGmr = generateGmr()
  const customsEmptyMrn = generateMrn()
  let customsEmptyChed

  const transitEmptyGmr = generateGmr()
  const transitEmptyMrn = generateMrn()
  let transitEmptyChed

  const customsNullGmr = generateGmr()
  const customsNullMrn = generateMrn()
  let customsNullChed

  const transitNullGmr = generateGmr()
  const transitNullMrn = generateMrn()
  let transitNullChed

  const onlyCustomsGmr = generateGmr()
  const onlyCustomsMrn = generateMrn()
  let onlyCustomsChed

  before(async () => {
    mainChed = await generateChed()
    gmr2Ched = await generateChed()
    customsEmptyChed = await generateChed()
    transitEmptyChed = await generateChed()
    customsNullChed = await generateChed()
    transitNullChed = await generateChed()
    onlyCustomsChed = await generateChed()

    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml', {
      mrn: customsMrn,
      ched: mainChed,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json', {
      ched: mainChed
    })
    await processorPostMatchedGmrFromFile('../data/gmr/gmr.json', {
      gmrId: mainGmrId,
      customs: [customsMrn],
      transits: [transitMrn],
      vrn,
      trns: [trn, trn]
    })

    // clearance-gmr-2.xml -> an MRN with no GMR link
    await sendCdsMessageFromFile('../data/gmr/clearance-gmr-2.xml', {
      mrn: gmr2Mrn,
      ched: gmr2Ched,
      correlationId: generateCorrelationId()
    })

    // 1-GMR-empty-customs
    await sendCdsMessageFromFile('../data/gmr/1-clearance-gmr-customs.xml', {
      mrn: customsEmptyMrn,
      ched: customsEmptyChed,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/gmr/1-ipaff-gmr-customs.json', {
      ched: customsEmptyChed
    })
    await processorPostMatchedGmrFromFile(
      '../data/gmr/1-gmr-empty-customs.json',
      {
        gmrId: customsEmptyGmr,
        transits: [customsEmptyMrn],
        vrn,
        trns: [trn, trn]
      }
    )

    // 2-GMR-empty-transit
    await sendCdsMessageFromFile('../data/gmr/2-clearance-gmr-transit.xml', {
      mrn: transitEmptyMrn,
      ched: transitEmptyChed,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/gmr/2-ipaff-gmr-transit.json', {
      ched: transitEmptyChed
    })
    await processorPostMatchedGmrFromFile(
      '../data/gmr/2-gmr-empty-transit.json',
      {
        gmrId: transitEmptyGmr,
        customs: [transitEmptyMrn],
        vrn,
        trns: [trn, trn]
      }
    )

    // 3-GMR-null-customs
    await sendCdsMessageFromFile(
      '../data/gmr/3-clearance-gmr-customs-null.xml',
      {
        mrn: customsNullMrn,
        ched: customsNullChed,
        correlationId: generateCorrelationId()
      }
    )
    await sendIpaffMessageFromFile(
      '../data/gmr/3-ipaff-gmr-customs-null.json',
      {
        ched: customsNullChed
      }
    )
    await processorPostMatchedGmrFromFile(
      '../data/gmr/3-gmr-null-customs.json',
      {
        gmrId: customsNullGmr,
        transits: [customsNullMrn],
        vrn,
        trns: [trn, trn]
      }
    )

    // 4-GMR-null-transit
    await sendCdsMessageFromFile(
      '../data/gmr/4-clearance-gmr-transit-null.xml',
      {
        mrn: transitNullMrn,
        ched: transitNullChed,
        correlationId: generateCorrelationId()
      }
    )
    await sendIpaffMessageFromFile(
      '../data/gmr/4-ipaff-gmr-transit-null.json',
      {
        ched: transitNullChed
      }
    )
    await processorPostMatchedGmrFromFile(
      '../data/gmr/4-gmr-null-transit.json',
      {
        gmrId: transitNullGmr,
        customs: [transitNullMrn],
        vrn,
        trns: [trn, trn]
      }
    )

    // 5-GMR (only customs)
    await sendCdsMessageFromFile('../data/gmr/5-clearance.xml', {
      mrn: onlyCustomsMrn,
      ched: onlyCustomsChed,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/gmr/5-ipaff.json', {
      ched: onlyCustomsChed
    })
    await processorPostMatchedGmrFromFile('../data/gmr/5-gmr.json', {
      gmrId: onlyCustomsGmr,
      customs: [onlyCustomsMrn],
      vrn,
      trns: [trn, trn]
    })

    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })

  it('Should check GMR link visibility', async () => {
    await SearchPage.open()
    await SearchPage.search(customsMrn)
    expect(await SearchResultsPage.getResultText()).toContain(customsMrn)
  })

  it('Should show GMR link for the customs MRN', async () => {
    expect(await SearchResultsPage.isGmrLinkDisplayedForMrn(customsMrn)).toBe(
      true
    )
  })

  it('Should not show GMR link for the clearance-gmr-2 MRN', async () => {
    expect(await SearchResultsPage.isGmrLinkDisplayedForMrn(gmr2Mrn)).toBe(
      false
    )
  })

  it('Should see GMR and MRN when customs is empty', async () => {
    await SearchPage.open()
    await SearchPage.search(customsEmptyGmr)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${customsEmptyGmr}`
    )
    await GmrSearchResultsPage.clickLinkedMrn(customsEmptyMrn)
    expect(await SearchResultsPage.getResultText()).toContain(customsEmptyMrn)
  })

  it('Should see GMR and MRN when transit is empty', async () => {
    await SearchPage.open()
    await SearchPage.search(transitEmptyGmr)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${transitEmptyGmr}`
    )
    await GmrSearchResultsPage.clickLinkedMrn(transitEmptyMrn)
    expect(await SearchResultsPage.getResultText()).toContain(transitEmptyMrn)
  })

  it('Should see GMR and MRN when customs is null', async () => {
    await SearchPage.open()
    await SearchPage.search(customsNullGmr)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${customsNullGmr}`
    )
    await GmrSearchResultsPage.clickLinkedMrn(customsNullMrn)
    expect(await SearchResultsPage.getResultText()).toContain(customsNullMrn)
  })

  it('Should see GMR and MRN when transit is null', async () => {
    await SearchPage.open()
    await SearchPage.search(transitNullGmr)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${transitNullGmr}`
    )
    await GmrSearchResultsPage.clickLinkedMrn(transitNullMrn)
    expect(await SearchResultsPage.getResultText()).toContain(transitNullMrn)
  })

  it('Should be able to search by VRN and check heading and title and row count and order', async () => {
    await SearchPage.open()
    await SearchPage.search(vrn)
    expect(await VrnTrnSearchResultsPage.getResultText()).toBe(
      `Showing result for\n${vrn}`
    )
    expect(await VrnTrnSearchResultsPage.getPageTitleText()).toBe(
      `Showing result for ${vrn} - Border Trade Matching Service`
    )
    expect(await VrnTrnSearchResultsPage.getLinkedGmrsHeaderText()).toBe(
      'Linked GMRs'
    )
    expect(await VrnTrnSearchResultsPage.getLinkedGmrsCount()).toBe(5)

    const rows = await VrnTrnSearchResultsPage.getLinkedGmrsRowData()
    const actual = rows.map((r) => [r.gmr, r.linkedDeclarations, r.arrivalText])
    const expected = [
      [onlyCustomsGmr, '1', 'Not arrived'],
      [customsEmptyGmr, '1', '19 February 2026, 10:00'],
      [customsNullGmr, '1', '18 February 2026, 09:00'],
      [transitNullGmr, '1', '17 February 2026, 11:00'],
      [transitEmptyGmr, '1', '17 February 2026, 09:00']
    ]
    expect(actual).toEqual(expected)
  })

  it('Should be able to navigate to GMR and MRN page from VRN search', async () => {
    await SearchPage.open()
    await SearchPage.search(vrn)
    const rows = await VrnTrnSearchResultsPage.getLinkedGmrsRowData()
    const firstGmrId = rows[0]?.gmr
    await VrnTrnSearchResultsPage.clickFirstLinkedGmr()
    expect(await GmrSearchResultsPage.getPageTitle()).toBe(
      `Showing result for ${firstGmrId} - Border Trade Matching Service`
    )
    const mrnRows = await GmrSearchResultsPage.getLinkedMrnData()
    const firstMrnId = mrnRows[0]?.mrn
    await GmrSearchResultsPage.clickFirstLinkedMrn()
    expect(await SearchResultsPage.getResultText()).toContain(firstMrnId)
  })

  it('Should be able to search by TRN and check heading and title and row count and order', async () => {
    await SearchPage.open()
    await SearchPage.search(trn)
    expect(await VrnTrnSearchResultsPage.getResultText()).toBe(
      `Showing result for\n${trn}`
    )
    expect(await VrnTrnSearchResultsPage.getPageTitleText()).toBe(
      `Showing result for ${trn} - Border Trade Matching Service`
    )
    expect(await VrnTrnSearchResultsPage.getLinkedGmrsHeaderText()).toBe(
      'Linked GMRs'
    )
    expect(await VrnTrnSearchResultsPage.getLinkedGmrsCount()).toBe(5)

    const rows = await VrnTrnSearchResultsPage.getLinkedGmrsRowData()
    const actual = rows.map((r) => [r.gmr, r.linkedDeclarations, r.arrivalText])
    const expected = [
      [onlyCustomsGmr, '1', 'Not arrived'],
      [customsEmptyGmr, '1', '19 February 2026, 10:00'],
      [customsNullGmr, '1', '18 February 2026, 09:00'],
      [transitNullGmr, '1', '17 February 2026, 11:00'],
      [transitEmptyGmr, '1', '17 February 2026, 09:00']
    ]
    expect(actual).toEqual(expected)
  })

  it('Should be able to navigate to GMR and MRN page from TRN search', async () => {
    await SearchPage.open()
    await SearchPage.search(trn)
    const rows = await VrnTrnSearchResultsPage.getLinkedGmrsRowData()
    const firstGmrId = rows[0]?.gmr
    await VrnTrnSearchResultsPage.clickFirstLinkedGmr()
    expect(await GmrSearchResultsPage.getPageTitle()).toBe(
      `Showing result for ${firstGmrId} - Border Trade Matching Service`
    )
    const mrnRows = await GmrSearchResultsPage.getLinkedMrnData()
    const firstMrnId = mrnRows[0]?.mrn
    await GmrSearchResultsPage.clickFirstLinkedMrn()
    expect(await SearchResultsPage.getResultText()).toContain(firstMrnId)
  })
})
