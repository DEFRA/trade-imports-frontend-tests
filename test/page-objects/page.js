import { browser, $ } from '@wdio/globals'

class Page {
  get pageHeading() {
    return $('h1')
  }

  async open(path) {
    return await browser.url(path)
  }

  async clickLink(element) {
    await element.waitForDisplayed({ timeout: 3000 })
    return await element.click()
  }

  async getTextFrom(element) {
    await element.waitForDisplayed({ timeout: 3000 })
    return await element.getText()
  }

  async elementIsDisplayed(element) {
    return await element.waitForDisplayed({ timeout: 3000 })
  }
}

export { Page }
