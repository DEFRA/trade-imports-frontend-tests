import { expect, $, $$, browser } from '@wdio/globals'

import HomePage from '../../page-objects/home.page.js'
import SearchPage from 'page-objects/search.page.js'
import SearchResultsPage from '../../page-objects/searchResultsPage.js'
import ChedDeclarationPage from '../../page-objects/ched-declaration.page.js'
import TimelinePage from '../../page-objects/timeline.page.js'
import { sendCdsMessageFromFile } from '../../utils/soapMessageHandler.js'
import { processorPostTracesChedFromFile } from '../../utils/processorClient.js'
import {
  generateMrn,
  generateChed,
  generateCorrelationId
} from '../../utils/id-generator.js'

describe('TRACES CHED search results page filter tests', () => {
  const mrn = generateMrn()
  const linkedMrn = generateMrn()
  let tracesChed

  before(async () => {
    tracesChed = await generateChed()
    await sendCdsMessageFromFile('../data/traces-ched/clearance-request.xml', {
      mrn,
      ched: tracesChed,
      correlationId: generateCorrelationId()
    })
    await sendCdsMessageFromFile('../data/traces-ched/clearance-request.xml', {
      mrn: linkedMrn,
      ched: tracesChed,
      correlationId: generateCorrelationId()
    })
    await processorPostTracesChedFromFile('../data/traces-ched/ched.json', {
      ched: tracesChed
    })

    await HomePage.open()
    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })

  const visibleAuthorities = async () => {
    const authorities = []
    const rows = await $$('#latest-view table.btms-declaration tbody tr')
    for (const row of rows) {
      if (await row.isDisplayed()) {
        authorities.push(await row.getAttribute('data-authority'))
      }
    }
    return authorities
  }

  const expectAllVisibleAuthoritiesAreApha = async () => {
    const authorities = await visibleAuthorities()
    expect(authorities.length).toBeGreaterThan(0)
    expect(authorities.every((authority) => authority === 'APHA')).toBe(true)
  }

  it('Should render the TRACES CHED alongside the customs declaration', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toContain(mrn)

    expect(await ChedDeclarationPage.getAllText(tracesChed)).toContain(
      'Salmo salar'
    )
  })

  it('Should keep the Latest tab filters working with a TRACES CHED present', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(mrn)

    expect(
      await ChedDeclarationPage.tracesChedTable(tracesChed).isExisting()
    ).toBe(true)

    const authorityFilter = $('#authority')
    await authorityFilter.waitForDisplayed({ timeout: 5000 })

    await authorityFilter.selectByVisibleText('APHA')
    await expectAllVisibleAuthoritiesAreApha()

    await authorityFilter.selectByVisibleText('POAO')
    expect(await visibleAuthorities()).toEqual([])

    await authorityFilter.selectByVisibleText('Show all')
    await expectAllVisibleAuthoritiesAreApha()
  })

  it('Should keep the timeline MRN filter working with a TRACES CHED present', async () => {
    await SearchPage.clickNavSearchLink()
    await SearchPage.search(mrn)

    await TimelinePage.clickTimelineTab()

    const mrnDropdown = TimelinePage.timelineMrnDropdown
    await mrnDropdown.waitForDisplayed({ timeout: 10000 })

    await mrnDropdown.selectByVisibleText(mrn)
    await browser.waitUntil(
      async () =>
        (await TimelinePage.mrnTimeline(mrn).isDisplayed()) &&
        !(await TimelinePage.mrnTimeline(linkedMrn).isDisplayed()),
      {
        timeout: 5000,
        timeoutMsg:
          'Selecting an MRN did not hide the other declaration timeline'
      }
    )
  })
})
