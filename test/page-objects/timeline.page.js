import { Page } from './page.js'

class TimelinePage extends Page {
  open() {
    return super.open('/search')
  }

  get timelineContainer() {
    return $('.moj-timeline.btms-search-result-timeline')
  }

  get latestTab() {
    return $('#tab_latest-view')
  }

  get timelineInfoMessage() {
    return $('.govuk-inset-text')
  }

  get timelineTab() {
    return $('#tab_timeline-view')
  }

  get timelineMrnDropdown() {
    return $('#timelineMrn')
  }

  async clickLatestTab() {
    await this.latestTab.click()
  }

  async clickTimelineTab() {
    await this.timelineTab.click()
  }

  async getTimelineInfoMessage() {
    return await this.getTextFrom(this.timelineInfoMessage)
  }

  async allTimelineText() {
    const elements = await this.timelineContainer.$$('*')
    let texts = []
    for (const el of elements) {
      const txt = await el.getText()
      if (txt && txt.trim()) {
        texts.push(txt.trim())
      }
    }
    texts = texts.filter((t) => !t.includes('\n'))
    return texts
  }

  async isTimelineMrnDropdownVisible() {
    return await this.timelineMrnDropdown.isDisplayed()
  }
}

export default new TimelinePage()
