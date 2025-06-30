import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class HomePage extends Page {
  open() {
    return super.open('/')
  }

  async login() {
    await $('a[href*="/sign-in"]').waitForExist({ timeout: 3000 })
    await $('a[href*="/sign-in"]').click()
  }

  async loginRegisteredUser() {
    const loginButtons = await $$('=Log in');
    await browser.waitUntil(async () => (await loginButtons.length) > 0, {
      timeout: 3000,
      timeoutMsg: 'No "Log in" buttons found within 3 seconds.'
    })
    await loginButtons[loginButtons.length - 1].click()
  }
}

export default new HomePage()
