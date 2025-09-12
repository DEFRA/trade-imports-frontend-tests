import { Page } from './page.js'

class ReportingPage extends Page {
  open() {
    return super.open('/reporting')
  }
}

export default new ReportingPage()
