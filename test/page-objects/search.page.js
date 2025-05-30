import { Page } from 'page-objects/page'

class SearchPage extends Page {
  open() {
    return super.open('/search')
  }

  get searchErrorTextElement() {
    return $('#search-term-error')
  }

  async searchBoxIsVisible() {
    await $('#search-term').waitForDisplayed({ timeout: 3000 })
    return await $('#search-term').isDisplayed()
  }

  async search(input) {
    await this.searchBoxIsVisible()
    await $('#search-term').setValue(input)
    await $('#btn-search').waitForDisplayed({ timeout: 3000 })
    await $('#btn-search').click()
  }

  async getSearchErrorText() {
    await this.searchErrorTextElement.waitForDisplayed({ timeout: 3000 })
    return await this.searchErrorTextElement.getText()
  }
}

export default new SearchPage()
