import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class CustomDeclaration extends Page {
  allText(mrn) {
    return $('details[aria-label="' + mrn + '"]')
  }

  get iuuDataAuthroty() {
    return $('details[aria-label] tr[data-authority="IUU"]')
  }

  async getAllText(mrn) {
    return await this.getTextFrom(this.allText(mrn))
  }

  async getIuuDataAuthroty() {
    return await this.getTextFrom(this.iuuDataAuthroty)
  }
}

export default new CustomDeclaration()
