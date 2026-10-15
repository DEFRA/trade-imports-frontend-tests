import { browser } from '@wdio/globals'
import { Page } from './page.js'

class SearchPage extends Page {
  open() {
    return super.open('/search')
  }

  get searchInputField() {
    return $('#search-term')
  }

  get searchButton() {
    return $('.btms-search-icon')
  }

  get searchErrorTextElement() {
    return $('#search-term-error')
  }

  get signOut() {
    return $('=Sign out')
  }

  get navSearchLink() {
    return $('a.govuk-service-navigation__link[href="/search"]')
  }

  get latestTab() {
    return $('#tab_latest-view')
  }

  get declarationMatchFilter() {
    return $('#match')
  }

  get declarationNoItemsMessage() {
    return $(
      '//*[@id="latest-view"]//table[contains(@class,"btms-declaration")]/preceding-sibling::div[contains(@class,"govuk-inset-text")][1]'
    )
  }

  get notificationAuthorityFilter() {
    return $('#chedAuthority')
  }

  get notificationNoItemsMessage() {
    return $(
      '//*[@id="latest-view"]//table[contains(@class,"btms-notification")]/preceding-sibling::div[contains(@class,"govuk-inset-text")][1]'
    )
  }

  get visibleDeclarationRows() {
    return $('#latest-view table.btms-declaration tbody').$$('tr:not([hidden])')
  }

  async search(input) {
    await this.elementIsDisplayed(this.searchInputField)
    await this.searchInputField.setValue(input)
    return await this.clickLink(this.searchButton)
  }

  async getSearchErrorText() {
    return await this.getTextFrom(this.searchErrorTextElement)
  }

  async signout() {
    await this.clickLink(this.signOut)
    await browser.waitUntil(async () => !(await this.signOut.isExisting()), {
      timeout: 5000,
      timeoutMsg: 'Sign out link did not disappear after clicking'
    })
  }

  async clickNavSearchLink() {
    await this.clickLink(this.navSearchLink)
  }

  async clickLatestTab() {
    await this.clickLink(this.latestTab)
  }

  async selectDeclarationMatchFilter(value) {
    await this.declarationMatchFilter.selectByVisibleText(value)
  }

  async selectNotificationAuthorityFilter(value) {
    await this.notificationAuthorityFilter.selectByVisibleText(value)
  }

  async getDeclarationNoItemsMessage() {
    return await this.getTextFrom(this.declarationNoItemsMessage)
  }

  async getNotificationNoItemsMessage() {
    return await this.getTextFrom(this.notificationNoItemsMessage)
  }

  async visibleDeclarationRowsCount() {
    return (await this.visibleDeclarationRows).length
  }

  async visibleNotificationRowsCount() {
    return $('#latest-view table.btms-notification tbody').$$(
      'tr:not([hidden])'
    ).length
  }

  async sessionActive() {
    return await this.signOut.isDisplayed()
  }

  async isSearchButtonVisible() {
    return await this.elementIsDisplayed(this.searchButton)
  }
}

export default new SearchPage()
