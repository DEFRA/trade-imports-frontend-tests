import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class Ched extends Page {
  get iuuDataAuthroty() {
    return $('details[aria-label] li[data-ched-authority="IUU"]')
  }

  async getIuuDataAuthroty() {
    return await this.getTextFrom(this.iuuDataAuthroty)
  }
}

export default new Ched()
