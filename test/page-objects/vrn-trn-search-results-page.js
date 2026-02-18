import { Page } from './page.js'

class VrnTrnSearchResultsPage extends Page {
  get resultTextElement() {
    return $('.govuk-heading-l')
  }

  get linkedGmrsHeader() {
    return $('h2.govuk-heading-m=Linked GMRs')
  }

  get linkedGmrsTable() {
    return $('//table[caption[normalize-space(.)="Linked GMRs"]]')
  }

  get linkedGmrsRows() {
    return $$('//table[caption[normalize-space(.)="Linked GMRs"]]/tbody/tr')
  }

  get firstLinkedGmrAnchor() {
    return $(
      '//table[caption[normalize-space(.)="Linked GMRs"]]/tbody/tr[1]/td[1]/a'
    )
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

  async getLinkedGmrsCount() {
    await this.elementIsDisplayed(this.linkedGmrsTable)
    return await this.linkedGmrsRows.length
  }

  async getLinkedGmrsArrivalTexts() {
    await this.elementIsDisplayed(this.linkedGmrsTable)
    const rows = await $$(
      '//table[caption[normalize-space(.)="Linked GMRs"]]/tbody/tr'
    )
    const arrivals = []
    for (const row of rows) {
      arrivals.push(await row.$('td:nth-child(3)').getText())
    }
    return await arrivals
  }

  async getLinkedGmrsRowData() {
    await this.elementIsDisplayed(this.linkedGmrsTable)
    await browser.waitUntil(
      async () => {
        const rows = await $$(
          '//table[caption[normalize-space(.)="Linked GMRs"]]/tbody/tr'
        )
        return rows.length > 0
      },
      { timeout: 5000, timeoutMsg: 'Linked GMR rows not found' }
    )
    const rows = await $$(
      '//table[caption[normalize-space(.)="Linked GMRs"]]/tbody/tr'
    )
    const data = []
    for (const row of rows) {
      const gmr = await row.$('td:nth-child(1) a').getText()
      const linkedDeclarations = await row.$('td:nth-child(2)').getText()
      const arrivalText = await row.$('td:nth-child(3)').getText()
      data.push({ gmr, linkedDeclarations, arrivalText })
    }
    return data
  }

  async clickFirstLinkedGmr() {
    await this.elementIsDisplayed(this.firstLinkedGmrAnchor)
    await this.clickLink(this.firstLinkedGmrAnchor)
  }
}
export default new VrnTrnSearchResultsPage()
