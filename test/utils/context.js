import { browser } from '@wdio/globals'

export const context = {
  platform: `${browser.capabilities.platformName} ${browser.capabilities.browserName} ${browser.capabilities.browserVersion}`
}
