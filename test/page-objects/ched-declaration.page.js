import { Page } from './page.js'
import { $, browser } from '@wdio/globals'

class Ched extends Page {
  allText(ched) {
    return $('details[aria-label="' + ched + '"]')
  }

  tracesChedTable(reference) {
    return $('details[aria-label="' + reference + '"] table.btms-traces-ched')
  }

  notificationRows(reference) {
    return browser.$$(
      'details[aria-label="' + reference + '"] table.btms-notification tbody tr'
    )
  }

  async getAllText(ched) {
    return await this.getTextFrom(this.allText(ched))
  }

  async getChedRows(reference) {
    const rows = await this.notificationRows(reference)
    const rowData = []

    for (const row of rows) {
      const cells = await row.$$('td')

      rowData.push({
        itemNumber: await cells[0].getText(),
        commodityCode: await cells[1].getText(),
        description: await cells[2].getText(),
        quantityWeight: await cells[3].getText(),
        authority: await cells[4].getText(),
        decision: await cells[5].getText()
      })
    }

    return rowData
  }
}

export default new Ched()
