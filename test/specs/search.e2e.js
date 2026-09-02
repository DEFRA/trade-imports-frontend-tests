import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page.js'
import SearchPage from 'page-objects/search.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'
import CustomDeclarationPage from '../page-objects/custom-declaration.page.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'
import { processorPostMatchedGmrFromFile } from '../utils/processorClient.js'
import {
  generateMrn,
  generateGmr,
  generateChed,
  generateChedPp,
  generateDucr,
  generateVrn,
  generateTrn,
  generateCorrelationId
} from '../utils/id-generator.js'

describe('Search page', () => {
  const cdsMrn = generateMrn()
  const cdsDucr = generateDucr()
  let cdsChed

  const e03Mrn = generateMrn()
  let e03Ched

  const chedPpMrn = generateMrn()
  let chedPpRefs

  const gmrId = generateGmr()
  const customsMrn = generateMrn()
  const transitMrn = generateMrn()
  let gmrChed
  const vrn = generateVrn()
  const trn = generateTrn()
  const trn2 = generateTrn()

  before(async () => {
    cdsChed = await generateChed()
    e03Ched = await generateChed()
    chedPpRefs = []
    for (let i = 0; i < 3; i++) {
      chedPpRefs.push(await generateChedPp())
    }
    gmrChed = await generateChed()

    await sendCdsMessageFromFile('../data/search/cds.xml', {
      mrn: cdsMrn,
      ducr: cdsDucr,
      ched: cdsChed,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/search/ipaff.json', {
      ched: cdsChed
    })

    await sendCdsMessageFromFile('../data/e03/e03.xml', {
      mrn: e03Mrn,
      ched: e03Ched,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/e03/e03.json', {
      ched: e03Ched
    })

    await sendCdsMessageFromFile(
      '../data/CHED-PP/C085_check/clearance-request.xml',
      {
        mrn: chedPpMrn,
        cheds: chedPpRefs,
        correlationId: generateCorrelationId()
      }
    )
    await sendIpaffMessageFromFile(
      '../data/CHED-PP/C085_check/9115-ched.json',
      {
        ched: chedPpRefs[0]
      }
    )
    await sendIpaffMessageFromFile(
      '../data/CHED-PP/C085_check/CO85-ched.json',
      {
        ched: chedPpRefs[1]
      }
    )
    await sendIpaffMessageFromFile(
      '../data/CHED-PP/C085_check/N851-ched.json',
      {
        ched: chedPpRefs[2]
      }
    )

    await sendCdsMessageFromFile('../data/gmr/clearance-gmr.xml', {
      mrn: customsMrn,
      ched: gmrChed,
      correlationId: generateCorrelationId()
    })
    await sendIpaffMessageFromFile('../data/gmr/ipaff-gmr.json', {
      ched: gmrChed
    })
    await processorPostMatchedGmrFromFile('../data/gmr/gmr.json', {
      gmrId,
      customs: [customsMrn],
      transits: [transitMrn],
      vrn,
      trns: [trn2, trn]
    })

    await HomePage.open()
    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })

  it('Should be able to search for a Valid MRN', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(cdsMrn)
    expect(await SearchResultsPage.getResultText()).toContain(cdsMrn)
  })

  it('Should be able to search for a Valid CHED', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(cdsChed)
    expect(await SearchResultsPage.getResultText()).toContain(cdsChed)

    const customDeclarationCheds = ['CHED Status', 'New']
    for (const ched of customDeclarationCheds) {
      expect(await CustomDeclarationPage.getAllText(cdsChed)).toContain(ched)
    }
  })

  it('Should be able to search for a Valid DUCR', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(cdsDucr)
    expect(await SearchResultsPage.getResultText()).toContain(cdsDucr)
  })

  it('should be able to search for a valid GMR and check GMR headings', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(gmrId)
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\n${gmrId}`
    )
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
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(gmrId)
    expect(await GmrSearchResultsPage.getVehicleRegistrationNumber()).toBe(vrn)
    expect(
      (await GmrSearchResultsPage.getTrailerRegistrationNumbers()).sort()
    ).toEqual([trn2, trn].sort())
  })

  it('should display correct linked customs declaration details for a valid GMR', async () => {
    const mrnData = await GmrSearchResultsPage.getLinkedMrnData()
    const expectedRows = [
      {
        mrn: customsMrn,
        cdsStatus: 'In progress - Awaiting IPAFFS',
        btmsDecision: 'Hold - Decision not given'
      },
      {
        mrn: transitMrn,
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

  it('should navigate to the correct customs declaration when clicking a linked MRN from GMR page', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(gmrId)
    await GmrSearchResultsPage.clickFirstLinkedMrn()
    expect(await SearchResultsPage.getCdsStatus()).toContain(
      'In progress - Awaiting IPAFFS'
    )
  })

  it('Should be able to search for a Valid MRN and see CHED-PP Document References', async () => {
    await SearchPage.open()
    await SearchPage.search(chedPpMrn)
    expect(await SearchResultsPage.getResultText()).toContain(chedPpMrn)

    for (const ched of chedPpRefs) {
      expect(await CustomDeclarationPage.getAllText(chedPpMrn)).toContain(ched)
    }

    expect(await SearchResultsPage.getCdsStatus()).toBe(
      'In progress - Awaiting IPAFFS'
    )
  })

  it('Should assert on the CDS status for E03', async () => {
    await SearchPage.open()
    await SearchPage.search(e03Mrn)
    expect(await SearchResultsPage.getCdsStatus()).toContain('In progress')
    const allText = await SearchResultsPage.customDeclarationAllResultText()
    const normalised = allText.replace(/\s+/g, ' ').trim()
    const expectedSnippet =
      'Data error - Unexpected data - transit, transhipment or specific warehouse'
    expect(normalised).toContain(expectedSnippet)
  })

  it('Should see error message when results not found for MRN', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search('24GBBGBKCDMS704000')
    expect(await SearchPage.getSearchErrorText()).toContain(
      '24GBBGBKCDMS704000 cannot be found'
    )
  })

  it('Should see error message when results not found for CHED', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search('CHEDA.GB.2025.1704000')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'CHEDA.GB.2025.1704000 cannot be found'
    )
  })

  it('Should see error message when results not found for DUCR', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search('4GB269573944000-PORTACDMS704000')
    expect(await SearchPage.getSearchErrorText()).toContain(
      '4GB269573944000-PORTACDMS704000 cannot be found'
    )
  })

  it('Should see error message when invalid search term provided', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search('bad search term')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'BAD SEARCH TERM cannot be found'
    )
  })

  it('Should see error message when searching for empty search term', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search('')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'Enter an MRN, CHED, GMR, VRN or TRN reference'
    )
  })

  it('should see error message saying valid GMR not found', async () => {
    const invalidGmr = 'GMRA000000XX'
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(invalidGmr)
    expect(await SearchPage.getSearchErrorText()).toContain(
      `${invalidGmr} cannot be found`
    )
  })

  it('should see error message GMR format is not valid', async () => {
    const invalidGmr = 'GMR1000000XX'
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(invalidGmr)
    expect(await SearchPage.getSearchErrorText()).toContain(
      `GMR1000000XX cannot be found`
    )
  })
})
