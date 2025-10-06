import { Page } from './page.js'
import { $ } from '@wdio/globals'
import { ensureTestUserExists } from '../setup/createTestUser.js'

class HomePage extends Page {
  open() {
    return super.open('/')
  }

  get signInLink() {
    return $('a[href*="/sign-in"]')
  }

  get gatewayRadioButton() {
    return $('input[id="authProvider-2"]')
  }

  get chooseSignInButton() {
    return $('form[action="/sign-in-choose"] button')
  }

  get signInBasedOnTestEmail() {
    return $('//tr[th[text()="front-end-tests@testexample.com"]]//td//a')
  }

  async login() {
    return await this.clickLink(this.signInLink)
  }

  async gatewayLogin() {
    await this.clickLink(this.gatewayRadioButton)
    return await this.clickLink(this.chooseSignInButton)
  }

  async loginRegisteredUser() {
    await ensureTestUserExists()
    return await this.clickLink(this.signInBasedOnTestEmail)
  }
}

export default new HomePage()
