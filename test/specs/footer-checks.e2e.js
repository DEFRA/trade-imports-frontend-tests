import HomePage from '../page-objects/home.page.js'
import SearchPage from '../page-objects/search.page.js'
import FooterPage from '../page-objects/footer.page.js'
import CookiesPage from '../page-objects/cookies.page.js'
import AccessibilityPage from '../page-objects/accessibility.page.js'

describe('Footer Links Checks', () => {
  it('Should see footer links on "home" page', async () => {
    await HomePage.open()
    // assertions
  })
  it('Should see footer links on "how to sign" in page', async () => {
    await HomePage.login()
    expect(await FooterPage.getAllLinkText()).toContain('Cookies')
    expect(await FooterPage.getAllLinkText()).toContain(
      'Accessibility statement'
    )
  })
  it('Should see footer links on "search" in page', async () => {
    await HomePage.gatewayLogin()
    await HomePage.loginRegisteredUser()
    expect(await FooterPage.getAllLinkText()).toContain('Cookies')
    expect(await FooterPage.getAllLinkText()).toContain(
      'Accessibility statement'
    )
  })
  it('Should see footer links on "search results" in page', async () => {
    const mrn = '24GBBGBKCDMS704607'
    await SearchPage.open()
    await SearchPage.search(mrn)
    expect(await FooterPage.getAllLinkText()).toContain('Cookies')
    expect(await FooterPage.getAllLinkText()).toContain(
      'Accessibility statement'
    )
  })
  it('Should see footer links on "sign out" in page', async () => {
    await SearchPage.signout()
    expect(await FooterPage.getAllLinkText()).toContain('Cookies')
    expect(await FooterPage.getAllLinkText()).toContain(
      'Accessibility statement'
    )
  })
  it('Should see footer links on "cookies" in page', async () => {
    await FooterPage.clickCookies()
    expect(await CookiesPage.getTitle()).toContain('Cookies')
  })
  it('Should see footer links on "accessibility" in page', async () => {
    await FooterPage.clickAccessibility()
    expect(await AccessibilityPage.getTitle()).toContain(
      'Accessibility statement for the Border Trade Matching Service (BTMS)'
    )
  })
})
