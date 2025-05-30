import { expect } from '@wdio/globals'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import HomePage from '../page-objects/home.page'
import SearchPage from 'page-objects/search.page'
import SearchResultsPage from '../page-objects/searchResultsPage'
import { sendSoapRequest } from '../utils/soapMessageHandler.js'
import { sendIpaffsMessage } from '../utils/ipaffsMessageHandler.js'

describe('Search page', () => {
  before(async () => {
    const __filename = fileURLToPath(import.meta.url)
    const __dirname = path.dirname(__filename)
    const soapFilePath = path.resolve(__dirname, '../data/cds.xml')
    const soapEnvelope = await readFile(soapFilePath, 'utf-8')
    await sendSoapRequest(soapEnvelope)

    const filePath = path.resolve(__dirname, '../data/ipaff.json')
    const fileContent = await readFile(filePath, 'utf-8')
    const json = JSON.parse(fileContent)
    await sendIpaffsMessage(json)
  })
  it('Should be able to login as a registered user and open Search Page', async () => {
    await HomePage.open()
    await HomePage.login()
    await HomePage.loginRegisteredUser()
    expect(await SearchPage.searchBoxIsVisible()).toBe(true)
  })
  it('Should be able to sarch for a Valid MRN', async () => {
    const mrn = '24GBBGBKCDMS704600'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await SearchResultsPage.getResultText()).toBe(mrn)
  })
  it('Should be able to sarch for a Valid CHED', async () => {
    const ched = 'CHEDA.GB.2025.1704600'
    await SearchPage.open()
    await SearchPage.search(ched)
    expect(await SearchResultsPage.getResultText()).toBe(ched)
  })
  it('Should be able to sarch for a Valid DUCR', async () => {
    const ducr = '4GB269573944000-PORTACDMS704600'
    await SearchPage.open()
    await SearchPage.search(ducr)
    expect(await SearchResultsPage.getResultText()).toBe(ducr)
  })
  it('Should see error message when results not found for MRN', async () => {
    await SearchPage.open()
    await SearchPage.search('24GBBGBKCDMS704000')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'This MRN, CHED or DUCR reference cannot be found'
    )
  })
  it('Should see error message when results not found for CHED', async () => {
    await SearchPage.open()
    await SearchPage.search('CHEDA.GB.2025.1704000')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'This MRN, CHED or DUCR reference cannot be found'
    )
  })
  it('Should see error message when results not found for DUCR', async () => {
    await SearchPage.open()
    await SearchPage.search('4GB269573944000-PORTACDMS704000')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'This MRN, CHED or DUCR reference cannot be found'
    )
  })
  it('Should see error message when invalid search term provided', async () => {
    await SearchPage.open()
    await SearchPage.search('bad search term')
    expect(await SearchPage.getSearchErrorText()).toContain(
      'You must enter a valid MRN, CHED or DUCR'
    )
  })
})
