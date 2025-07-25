import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class Ched extends Page {
  allText(ched) {
    return $('details[aria-label="' + ched + '"]')
  }

  get iuuDataAuthroty() {
    return $('details[aria-label] li[data-ched-authority="IUU"]')
  }

  async getAllText(ched) {
    return await this.getTextFrom(this.allText(ched))
  }

  async getIuuDataAuthroty() {
    return await this.getTextFrom(this.iuuDataAuthroty)
  }
}

export default new Ched()
