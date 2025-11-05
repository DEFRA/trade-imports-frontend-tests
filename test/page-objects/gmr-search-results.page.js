import { Page } from './page.js'

class GmrSearchResultsPage extends Page {
  // Open the GMR results page for a specific search term (GMR ID)
  open(searchTerm) {
    return super.open(
      `/gmr-results?searchTerm=${encodeURIComponent(searchTerm)}`
    )
  }

  // --- Getters ---
  get headingElement() {
    return $('h1.govuk-heading-l')
  }

  get vehicleDetailsHeadingElement() {
    return $('h2.govuk-heading-m=Vehicle details')
  }

  get vehicleVrnValue() {
    return $(
      '//h2[normalize-space()="Vehicle details"]/following::dl[1]//dt[normalize-space()="Vehicle Registration Number (VRN)"]/following-sibling::dd//span[contains(@class,"gmr-number-plate__front")]'
    )
  }

  get trailerRegistrationSpans() {
    return $$(
      '//h2[normalize-space()="Vehicle details"]/following::dl[1]//dt[normalize-space()="Trailer Registration Number (TRN)"]/following-sibling::dd//span[contains(@class,"gmr-number-plate__rear")]'
    )
  }

  get linkedCustomsTableRows() {
    return $$('table.govuk-table tbody.govuk-table__body tr.govuk-table__row')
  }

  get linkedCustomsHeadingElement() {
    return $(
      '//h3[contains(@class,"govuk-heading-m") and contains(@class,"govuk-!-margin-top-3") and normalize-space()="Linked customs declarations"]'
    )
  }

  // --- Methods ---
  async getDisplayedGmr() {
    const text = await this.headingElement.getText()
    return text.replace(/Showing result for/i, '').trim()
  }

  async getVehicleRegistrationNumber() {
    return (await this.vehicleVrnValue.getText()).trim()
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
    const rows = await this.linkedCustomsTableRows
    const results = []
    for (const row of rows) {
      const cells = await row.$$('td.govuk-table__cell')
      if (Array.isArray(cells) && cells.length >= 3) {
        const mrn = (await cells[0].getText()).trim()
        const cdsStatus = (await cells[1].getText()).trim()
        const btmsDecision = (await cells[2].getText()).trim()
        results.push({ mrn, cdsStatus, btmsDecision })
      }
    }
    return results
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
    return (await this.vehicleDetailsHeadingElement.getText()).trim()
  }

  async getPageTitle() {
    return (await browser.getTitle()).trim()
  }

  async getLinkedCustomsHeading() {
    return (await this.linkedCustomsHeadingElement.getText()).trim()
  }
}

export default new GmrSearchResultsPage()
