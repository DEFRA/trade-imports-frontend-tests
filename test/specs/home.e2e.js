import { browser, expect } from '@wdio/globals'

import HomePage from 'page-objects/home.page'

describe('Home page', () => {
  it('Should be on the "Home" page', async () => {
    await HomePage.open()
    await expect(browser).toHaveTitle('Home - Border Trade Matching Service')
  })

  it('Shoult be able to see list of registered users', async () => {
    await HomePage.login()
    await expect(browser).toHaveTitle('DEFRA ID Login | cdp-defra-id-stub')
  })
})
