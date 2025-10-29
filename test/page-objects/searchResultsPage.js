import { Page } from './page.js'

class SearcheResultsPage extends Page {
  get cdsStatusElement() {
    return $('.btms-customs-declaration-summary .govuk-tag--yellow')
  }

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

  async getCdsStatus() {
    return (await this.cdsStatusElement.getText()).trim()
  }
}

export default new SearcheResultsPage()
