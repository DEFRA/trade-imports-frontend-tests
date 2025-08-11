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
  }
}

export default new SearchPage()
