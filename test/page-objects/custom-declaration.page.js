import { Page } from './page.js'
import { $, browser } from '@wdio/globals'

class CustomDeclaration extends Page {
  allText(mrn) {
    return $('details[aria-label="' + mrn + '"]')
  }

  customsRows(mrn) {
    return browser.$$(
      'details[aria-label="' + mrn + '"] table.btms-declaration tbody tr'
    )
  }

  async getAllText(mrn) {
    return await this.getTextFrom(this.allText(mrn))
  }

  async getCustomsRows(mrn) {
    const rows = await this.customsRows(mrn)
    const rowData = []

    for (const row of rows) {
      const cells = await row.$$('td')

      rowData.push({
        itemNumber: await cells[0].getText(),
        commodityCode: await cells[1].getText(),
        description: await cells[2].getText(),
        quantityWeight: await cells[3].getText(),
        chedReference: await cells[4].getText(),
        match: await cells[5].getText(),
        authority: await cells[6].getText(),
        decision: await cells[7].getText()
      })
    }

    return rowData
  }
}

export default new CustomDeclaration()
