import { Page } from './page.js'
import { $ } from '@wdio/globals'

class HomePage extends Page {
  open() {
    return super.open('/')
  }

  get signInLink() {
    return $('a[href*="/sign-in"]')
  }

  get signInBasedOnTestEmail() {
    return $('//tr[th[text()="muddin@equalexperts.com"]]//td//a')
  }

  async login() {
    return await this.clickLink(this.signInLink)
  }

  async loginRegisteredUser() {
    return await this.clickLink(this.signInBasedOnTestEmail)
  }
}

export default new HomePage()
