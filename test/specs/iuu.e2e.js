import { expect } from '@wdio/globals'

import HomePage from '../page-objects/home.page.js'
import SearchPage from '../page-objects/search.page.js'
import SearchResultsPage from '../page-objects/searchResultsPage.js'
import CustomDeclaration from '../page-objects/custom-declaration.page.js'
import chedDeclarationPage from '../page-objects/ched-declaration.page.js'
import { sendCdsMessageFromFile } from '../utils/soapMessageHandler.js'
import { sendIpaffMessageFromFile } from '../utils/ipaffsMessageHandler.js'

describe('Search Results Page for IUU', () => {
  before(async () => {
    await sendCdsMessageFromFile('../data/iuu/iuu.xml')
    await sendIpaffMessageFromFile('../data/iuu/iuu.json')

    await HomePage.open()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }
  })

  it('Should be able to search for a Valid MRN and see IUU Checks', async () => {
    const mrn = '24GBBGBKCDMS836050'

    await SearchPage.open()
    await SearchPage.search(mrn)

    expect(await SearchResultsPage.getResultText()).toContain(mrn)

    const customsRows = await CustomDeclaration.getCustomsRows(mrn)

    const customsIuuRows = customsRows.filter((row) => row.authority === 'IUU')

    expect(customsIuuRows).toHaveLength(1)

    expect(customsIuuRows[0]).toEqual(
      expect.objectContaining({
        decision: expect.stringContaining('Release - IUU inspection complete')
      })
    )

    const chedRows = await chedDeclarationPage.getChedRows()

    const chedIuuRows = chedRows.filter((row) => {
      return row.authority.split('\n').includes('IUU')
    })

    expect(chedIuuRows).toHaveLength(1)

    expect(chedIuuRows[0]).toEqual(
      expect.objectContaining({
        decision: expect.stringContaining('IUU inspection complete')
      })
    )

    expect(await SearchResultsPage.getCdsStatus()).toBe(
      'In progress - Awaiting CDS'
    )

    expect(await SearchResultsPage.isGmrLinkDisplayed()).toBe(false)
  })
})
