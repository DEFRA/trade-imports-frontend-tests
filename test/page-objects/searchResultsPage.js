import { Page } from 'page-objects/page'

class SearcheResultsPage extends Page {
  get resultTextElement() {
    return $('.govuk-heading-l')
  }

  async getResultText() {
    await this.resultTextElement.waitForDisplayed({ timeout: 3000 })
    return await this.resultTextElement.getText()
  }
}

export default new SearcheResultsPage()
