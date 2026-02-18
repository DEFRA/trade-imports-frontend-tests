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
    return this.linkedGmrsRows.length
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
    return arrivals
  }

  async getLinkedGmrsParsedArrivalTimes() {
    const arrivals = await this.getLinkedGmrsArrivalTexts()
    const monthIdx = {
      January: 0,
      February: 1,
      March: 2,
      April: 3,
      May: 4,
      June: 5,
      July: 6,
      August: 7,
      September: 8,
      October: 9,
      November: 10,
      December: 11
    }
    const parse = (t) => {
      if (t === 'Not arrived') return null
      const [datePart, timePart] = t.split(', ')
      const [dayStr, monthStr, yearStr] = datePart.split(' ')
      const [hourStr, minuteStr] = timePart.split(':')
      return new Date(
        parseInt(yearStr, 10),
        monthIdx[monthStr],
        parseInt(dayStr, 10),
        parseInt(hourStr, 10),
        parseInt(minuteStr, 10)
      ).getTime()
    }
    return arrivals.map(parse)
  }
}
export default new VrnTrnSearchResultsPage()
