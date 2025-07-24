import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class CustomDeclaration extends Page {
  get iuuDataAuthroty() {
    return $('details[aria-label] li[data-authority="IUU"]')
  }

  async getIuuDataAuthroty() {
    return await this.getTextFrom(this.iuuDataAuthroty)
  }
}

export default new CustomDeclaration()
