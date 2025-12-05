import { expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page.js'
import LatestActivityPage from '../page-objects/latest-activity.page'

describe('Latest Activity Page', () => {
  it('should display BTMS, CDS, and IPAFFS headers, all message rows, and valid date fields', async () => {
    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
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
