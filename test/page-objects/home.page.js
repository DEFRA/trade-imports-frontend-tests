import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class HomePage extends Page {
  open() {
    return super.open('/')
  }

  async login() {
    await $('#login-link').waitForExist({ timeout: 3000 })
    await $('#login-link').click()
  }

  async loginRegisteredUser() {
    await $('=Log in').waitForExist({ timeout: 3000 })
    await $('=Log in').click()
  }
}

export default new HomePage()
