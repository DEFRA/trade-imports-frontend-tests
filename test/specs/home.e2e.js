import { browser, expect } from '@wdio/globals'

import HomePage from 'page-objects/home.page'
import * as allure from 'allure-js-commons'
import { context } from '~/test/utils/context.js'

describe('Home page', () => {
  before(async () => {
    await allure.tag(context.platform)
  })
  it('Should be on the "Home" page', async () => {
    await HomePage.open()
    await expect(browser).toHaveTitle(
      'Border Trade Matching Service - Border Trade Matching Service'
    )
  })

  it('Should be able to see list of registered users', async () => {
    await HomePage.login()
    await HomePage.gatewayLogin()
    await expect(browser).toHaveTitle('DEFRA ID Login | cdp-defra-id-stub')
  })
})
