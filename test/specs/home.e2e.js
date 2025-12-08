import { browser, expect } from '@wdio/globals'

import HomePage from 'page-objects/home.page'
import Context from '~/test/utils/context.js'
import { addArgument, addSubSuite, addTag } from '@wdio/allure-reporter'

describe('Home page', () => {
  it('Should be on the "Home" page', async () => {
    addTag(Context.platform)
    addArgument('platform', Context.platform)
    addSubSuite(Context.platform)
    await HomePage.open()
    await expect(browser).toHaveTitle(
      'Border Trade Matching Service - Border Trade Matching Service'
    )
  })

  it('Should be able to see list of registered users', async () => {
    addTag(Context.platform)
    addArgument('platform', Context.platform)
    addSubSuite(Context.platform)
    await HomePage.login()
    await HomePage.gatewayLogin()
    await expect(browser).toHaveTitle('DEFRA ID Login | cdp-defra-id-stub')
  })
})
