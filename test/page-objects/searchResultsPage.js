import { Page } from './page.js'

class SearcheResultsPage extends Page {
  get resultTextElement() {
    return $('.govuk-heading-l')
  }

  get customDeclarationAllResultTextElement() {
    return $('.btms-details')
  }

  get ipaffDeclarationAllResultTextElement() {
    return $('.btms-details')
  }

  async getResultText() {
    return await this.getTextFrom(this.resultTextElement)
  }

  async customDeclarationAllResultText() {
    return await this.getTextFrom(this.customDeclarationAllResultTextElement)
  }

  async ipaffDeclarationAllResultText() {
    return await this.getResultText(this.ipaffDeclarationAllResultTextElement)
  }
}

export default new SearcheResultsPage()
