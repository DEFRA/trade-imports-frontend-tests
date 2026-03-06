import { Page } from './page.js'

class TimelinePage extends Page {
  open() {
    return super.open('/search')
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

  async clickLatestTab() {
    await this.latestTab.click()
  }

  async clickTimelineTab() {
    await this.timelineTab.click()
  }

  async getTimelineInfoMessage() {
    return await this.getTextFrom(this.timelineInfoMessage)
  }
}

export default new TimelinePage()
