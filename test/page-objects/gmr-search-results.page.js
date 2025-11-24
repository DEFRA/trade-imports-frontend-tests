import { Page } from './page.js'

class GmrSearchResultsPage extends Page {
  // Open the GMR results page for a specific search term (GMR ID)
  open(searchTerm) {
    return super.open(
      `/gmr-search-result?searchTerm=${encodeURIComponent(searchTerm)}`
    )
  }

  get headingElement() {
    return $('h1.govuk-heading-l')
  }

  get vehicleDetailsHeadingElement() {
    return $('h2.govuk-heading-m=Vehicle details')
  }

  get vehicleVrnValue() {
    return $(
      "//span[contains(@class,'vehicle-number-plate--front') and starts-with(@aria-label,'Vehicle registration number')]"
    )
  }

  get trailerRegistrationSpans() {
    return $$(
      "//span[contains(@class,'vehicle-number-plate--rear') and starts-with(@aria-label,'Trailer registration number ')]"
    )
  }

  get linkedCustomsTableRows() {
    return $$('table.govuk-table tbody.govuk-table__body tr.govuk-table__row')
  }

  get linkedCustomsHeadingElement() {
    return $('h3.govuk-heading-m=Linked customs declarations')
  }

  get firstMrnAnchor() {
    return $(
      'table.govuk-table tbody.govuk-table__body tr.govuk-table__row:first-child td.govuk-table__cell a'
    )
  }

  async getDisplayedGmr() {
    return this.getTextFrom(this.headingElement)
  }

  async getVehicleRegistrationNumber() {
    return this.getTextFrom(this.vehicleVrnValue)
  }

  async getTrailerRegistrationNumbers() {
    const spans = await this.trailerRegistrationSpans
    if (!Array.isArray(spans) || spans.length === 0) {
      return []
    }
    const results = []
    for (const span of spans) {
      results.push((await span.getText()).trim())
    }
    return results
  }

  async getLinkedCustomsRows() {
    return this.getLinkedMrnData()
  }

  async getCdsStatusForMrn(mrn) {
    const rows = await this.getLinkedCustomsRows()
    const found = rows.find((r) => r.mrn === mrn)
    return found ? found.cdsStatus : undefined
  }

  async getBtmsDecisionForMrn(mrn) {
    const rows = await this.getLinkedCustomsRows()
    const found = rows.find((r) => r.mrn === mrn)
    return found ? found.btmsDecision : undefined
  }

  async getVehicleDetailsHeading() {
    return this.getTextFrom(this.vehicleDetailsHeadingElement)
  }

  async getPageTitle() {
    return (await browser.getTitle()).trim()
  }

  async getLinkedCustomsHeading() {
    return this.getTextFrom(this.linkedCustomsHeadingElement)
  }

  async getLinkedMrnData() {
    const rows = await this.linkedCustomsTableRows
    const results = []
    for (const row of rows) {
      const cells = await row.$$('td.govuk-table__cell')
      if (!Array.isArray(cells) || cells.length < 3) continue
      let mrn = ''
      const anchor = await cells[0].$('a')
      if (await anchor.isExisting()) {
        mrn = (await anchor.getText()).trim()
      } else {
        const unknownWrapper = await cells[0].$('.tooltiplink')
        if (await unknownWrapper.isExisting()) {
          mrn =
            (await unknownWrapper.getAttribute('aria-describedby'))?.trim() ||
            (await unknownWrapper.getText()).split(/\n/)[0].trim()
        } else {
          mrn = (await cells[0].getText()).trim().split(/\n/)[0]
        }
      }
      const statusSpan = await cells[1].$('span.govuk-tag')
      const cdsStatus = (await statusSpan.isExisting())
        ? (await statusSpan.getText()).trim()
        : (await cells[1].getText()).trim()
      const btmsDecision = (await cells[2].getText()).trim()
      results.push({ mrn, cdsStatus, btmsDecision })
    }
    return results
  }

  async getLinkedMrns() {
    return (await this.getLinkedMrnData()).map((r) => r.mrn)
  }

  async clickFirstLinkedMrn() {
    await this.elementIsDisplayed(this.firstMrnAnchor)
    await this.clickLink(this.firstMrnAnchor)
  }

  async clickLinkedMrn(mrn) {
    const rows = await this.linkedCustomsTableRows
    for (const row of rows) {
      const anchor = await row.$('td.govuk-table__cell a')
      if (!(await anchor.isExisting())) continue
      const text = (await anchor.getText()).trim()
      if (text === mrn) {
        await this.elementIsDisplayed(anchor)
        await this.clickLink(anchor)
        return
      }
    }
    throw new Error(`Linked MRN ${mrn} not found or not clickable`)
  }
}

export default new GmrSearchResultsPage()
