import { Page } from './page.js'

class SearchResultsPage extends Page {
  get customsDeclarationSummary() {
    return $('.btms-customs-declaration-summary')
  }

  get cdsStatusTagCandidates() {
    // Different statuses may render different coloured tags.
    return $$(
      [
        '.btms-customs-declaration-summary .govuk-tag--yellow',
        '.btms-customs-declaration-summary .govuk-tag--green',
        '.btms-customs-declaration-summary .govuk-tag--red',
        '.btms-customs-declaration-summary .govuk-tag--grey'
      ].join(', ')
    )
  }

  get cdsStatusTagElement() {
    return $(
      '.btms-customs-declaration-summary .govuk-tag[class*="govuk-tag--"]'
    )
  }

  get resultTextElement() {
    return $('.govuk-heading-l')
  }

  get customDeclarationAllResultTextElement() {
    return $('.btms-details')
  }

  get ipaffDeclarationAllResultTextElement() {
    return $('.btms-details')
  }

  get gmrLinkElement() {
    return $(
      '//dl[contains(@class,"btms-customs-declaration-summary")]//dt[normalize-space()="GMR"]/following-sibling::dd//a'
    )
  }

  async getResultText() {
    return await this.getTextFrom(this.resultTextElement)
  }

  async customDeclarationAllResultText() {
    return await this.getTextFrom(this.customDeclarationAllResultTextElement)
  }

  async ipaffDeclarationAllResultText() {
    return await this.getResultText(this.ipaffDeclarationAllResultTextElement)
  }

  async getGmrValue() {
    return await this.getTextFrom(this.gmrLinkElement)
  }

  async clickGmrLink() {
    return await this.clickLink(this.gmrLinkElement)
  }

  async isGmrLinkDisplayed() {
    const el = await this.gmrLinkElement
    if (!(await el.isExisting())) return false
    return await el.isDisplayed()
  }

  async getCdsStatus() {
    const tags = await this.cdsStatusTagCandidates
    for (const tag of tags) {
      if (await tag.isExisting()) {
        const text = (await tag.getText()).trim()
        if (text) return text
      }
    }
    // Fallback: attempt to read raw text from summary container
    if (await this.customsDeclarationSummary.isExisting()) {
      return (await this.customsDeclarationSummary.getText()).trim()
    }
    return ''
  }

  async getCdsStatusTagColor() {
    await this.customsDeclarationSummary.waitForExist({ timeout: 5000 })
    const el = await this.cdsStatusTagElement
    if (!(await el.isExisting())) return ''
    const classes = (await el.getAttribute('class'))?.split(/\s+/) || []
    const colorClass = classes.find((c) => c.startsWith('govuk-tag--'))
    return colorClass ? colorClass.replace('govuk-tag--', '') : ''
  }

  async getCdsStatusWithColor() {
    const text = await this.getCdsStatus()
    const color = await this.getCdsStatusTagColor()
    return { text, color }
  }
}
export default new SearchResultsPage()
