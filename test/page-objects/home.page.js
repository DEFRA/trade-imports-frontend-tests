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
    await $('=Log in').waitForExist({ timeout: 3000 })
    await $('=Log in').click()
  }
}

export default new HomePage()
