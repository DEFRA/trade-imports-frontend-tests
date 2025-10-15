import { expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page.js'
import LatestActivityPage from '../page-objects/latest-activity.page'

describe('Latest Activity Page', () => {
  it('should display BTMS, CDS, and IPAFFS headers', async () => {
    await HomePage.open()
    await HomePage.login()
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    await LatestActivityPage.open()
    expect(await LatestActivityPage.isBtmsHeaderVisible()).toBe(true)
    expect(await LatestActivityPage.isCdsHeaderVisible()).toBe(true)
    expect(await LatestActivityPage.isIpaffsHeaderVisible()).toBe(true)
  })
})
