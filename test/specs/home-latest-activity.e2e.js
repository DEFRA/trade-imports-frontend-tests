import { expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page.js'
import LatestActivityPage from '../page-objects/latest-activity.page.js'
import SearchPage from 'page-objects/search.page.js'

describe('Home and Latest Activity Page', () => {
  it('Should be on the "Home" page', async () => {
    await HomePage.open()

    if (await SearchPage.sessionActive()) {
      await SearchPage.signout()
      await HomePage.open()
    }

    await expect(browser).toHaveTitle(
      'Border Trade Matching Service - Border Trade Matching Service'
    )
  })

  it('Should be able to see list of registered users', async () => {
    await HomePage.login()
    await HomePage.gatewayLogin()
    await expect(browser).toHaveTitle('DEFRA ID Login | cdp-defra-id-stub')
  })

  it('should display BTMS, CDS, and IPAFFS headers, all message rows, and valid date fields', async () => {
    await HomePage.loginRegisteredUser()

    if (!(await SearchPage.sessionActive())) {
      await HomePage.login()
      await HomePage.gatewayLogin()
      await HomePage.loginRegisteredUser()
    }

    await LatestActivityPage.clickNavLatestActivityLink()
    expect(await LatestActivityPage.isBtmsHeaderVisible()).toBe(true)
    expect(await LatestActivityPage.isCdsHeaderVisible()).toBe(true)
    expect(await LatestActivityPage.isIpaffsHeaderVisible()).toBe(true)
    expect(await LatestActivityPage.isDecisionVisible()).toBe(true)
    expect(await LatestActivityPage.isClearanceRequestVisible()).toBe(true)
    expect(await LatestActivityPage.isFinalisationVisible()).toBe(true)
    expect(await LatestActivityPage.isNotificationVisible()).toBe(true)
    expect(await LatestActivityPage.areAllDatesValid()).toBe(true)
  })
})
