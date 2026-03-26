import { expect, browser } from '@wdio/globals'

import HomePage from '../page-objects/home.page.js'
import SearchPage from '../page-objects/search.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import LatestActivityPage from '../page-objects/latest-activity.page.js'
import GmrSearchResultsPage from '../page-objects/gmr-search-results.page.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendGmrMessageFromFile } from '../utils/gmrMessageHandler.js'

describe('Page Redirection', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/search/cds.xml')
    await sendGmrMessageFromFile('../data/gmr/gmr.json')

    await HomePage.open()
    if (await SearchPage.sessionActive()) {
      await SearchPage.signout()
    }
  })

  afterEach(async () => {
    await HomePage.open()
    if (await SearchPage.sessionActive()) {
      await SearchPage.signout()
    }
  })

  it('Should get redirected when going to the Search Page without logging in', async () => {
    await HomePage.openPage('/search')
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage('/search')
    expect(await SearchPage.isSearchButtonVisible()).toBe(true)
  })

  it('Should get redirected when going to the Search Results Page for an MRN without logging in', async () => {
    await HomePage.openPage('/search-result?searchTerm=24GBBGBKCDMS704709')
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage('/search-result?searchTerm=24GBBGBKCDMS704709')
    expect(await SearchResultsPage.getResultText()).toContain(
      '24GBBGBKCDMS704709'
    )
  })

  it('Should get redirected when going to the Search Results Page for an GMR without logging in', async () => {
    await HomePage.openPage('/gmr-search-result?searchTerm=GMRA11350001')
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage('/gmr-search-result?searchTerm=GMRA11350001')
    expect(await GmrSearchResultsPage.getDisplayedGmr()).toBe(
      `Showing result for\nGMRA11350001`
    )
  })

  it('Should get redirected when going to the Reporting Page without logging in', async () => {
    await HomePage.openPage('/reporting')
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage('/reporting')
    await expect(browser).toHaveTitle(
      'BTMS reporting data - Border Trade Matching Service'
    )
  })

  it('Should get redirected when going to the Latest Activity Page without logging in', async () => {
    await HomePage.openPage('/latest-activity')
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage('/latest-activity')
    expect(await LatestActivityPage.isBtmsHeaderVisible()).toBe(true)
  })

  it('Should get redirected when going to the Admin DLQ Page without logging in', async () => {
    await HomePage.openPage('/admin/dlq')
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage('/admin/dlq')
    await expect(browser).toHaveTitle(
      'You do not have the correct permissions to access this service - Border Trade Matching Service'
    )
  })

  it('Should get redirected when going to the Admin messages Page without logging in', async () => {
    await HomePage.openPage('/admin/messages')
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage('/admin/messages')
    await expect(browser).toHaveTitle(
      'You do not have the correct permissions to access this service - Border Trade Matching Service'
    )
  })

  it('Should get redirected when going to the Admin Search Results Page without logging in', async () => {
    await HomePage.openPage(
      '/admin/messages?searchTerm=24GBBGBKCDMS704709&searchType=information'
    )
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage(
      '/admin/messages?searchTerm=24GBBGBKCDMS704709&searchType=information'
    )
    await expect(browser).toHaveTitle(
      'You do not have the correct permissions to access this service - Border Trade Matching Service'
    )
  })

  it('Should get redirected when trying to download a manual release report', async () => {
    await HomePage.openPage(
      '/reporting/manual-releases.csv?startDate=24%2F3%2F2026&endDate=24%2F3%2F2026'
    )
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage(
      '/reporting/manual-releases.csv?startDate=24%2F3%2F2026&endDate=24%2F3%2F2026'
    )
    expect(await HomePage.isGatewayRadioButtonVisibleWithoutCheck()).toBe(false)
  })

  it('Should get redirected when trying to download a no match report', async () => {
    await HomePage.openPage(
      '/reporting/no-matches.csv?startDate=24%2F3%2F2026&endDate=24%2F3%2F2026'
    )
    expect(await HomePage.isGatewayRadioButtonVisible()).toBe(true)

    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await HomePage.openPage(
      '/reporting/no-matches.csv?startDate=24%2F3%2F2026&endDate=24%2F3%2F2026'
    )
    expect(await HomePage.isGatewayRadioButtonVisibleWithoutCheck()).toBe(false)
  })
})
