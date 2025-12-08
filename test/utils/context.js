import { browser } from '@wdio/globals'

class Context {
  get platform() {
    return `${browser.capabilities.platformName} ${browser.capabilities.browserName} ${browser.capabilities.browserVersion}`
  }
}

export default new Context()
