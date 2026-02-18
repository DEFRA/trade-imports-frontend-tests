import { Page } from './page.js'

class VrnTrnSearchResultsPage extends Page {
  get resultTextElement() {
    return $('.govuk-heading-l')
  }

  get linkedGmrsHeader() {
    return $('h2.govuk-heading-m=Linked GMRs')
  }

  async getResultText() {
    return await this.getTextFrom(this.resultTextElement)
  }

  async getPageTitleText() {
    return await browser.getTitle()
  }

  async getLinkedGmrsHeaderText() {
    return await this.getTextFrom(this.linkedGmrsHeader)
  }
}
export default new VrnTrnSearchResultsPage()
