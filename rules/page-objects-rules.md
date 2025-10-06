# Page Object Generation Rules

Defines standards and best practices for generating and maintaining **Page Object Model (POM)** classes within end-to-end (E2E) or UI testing frameworks. These rules govern the structure, naming, and responsibilities of page objects to ensure test maintainability, scalability, and readability.

---

## Context

Page Objects encapsulate the structure and behavior of a page or component within a UI test suite. They abstract interactions away from the tests themselves, enabling reuse and reducing test brittleness when the UI changes.

**Applies to:** UI automation projects (e.g., WebdriverIO, Playwright, Cypress)  
**Level:** Tactical  
**Audience:** Test Automation Developers, QA Engineers, and Developers writing E2E/UI tests

---

## Core Principles

1. **Encapsulation:** Each page object must encapsulate the locators and actions of a single page or component to reduce duplication and increase reusability.
2. **Abstraction:** Page objects must hide the technical details of selectors and DOM operations from test scripts, providing clear, high-level business actions.
3. **Maintainability:** The design must minimize impact from UI changes by localizing selectors and logic in one place.
4. **Location:** Page objects should be created **trade-imports-frontend-tests/test/page-objects**

---

## Rules

### Must Have (Critical)

- **RULE-001:** Each page object must represent **a single logical page or reusable component**, not multiple unrelated pages.
- **RULE-002:** All selectors must be defined as **getters**, not hard-coded inside methods. This ensures reusability and consistency.
- **RULE-003:** Page objects must not include **assertions or test logic**. Validation belongs in test files, not in page objects.

---

### Should Have (Important)

- **RULE-101:** Methods should represent **high-level user actions** (e.g., `login()`, `navigateToSettings()`) rather than low-level DOM interactions.
- **RULE-102:** All methods should be **asynchronous** (using `async/await`) to handle promises from browser actions cleanly.
- **RULE-103:** Extend a common **base `Page` class** (e.g., `Page.js`) that provides shared functionality like navigation, waits, or utility methods.

---

### Could Have (Preferred)

- **RULE-201:** Use **semantic names** for selectors and methods reflecting user intent, not UI implementation details.
- **RULE-202:** Group related elements or actions logically (e.g., `HomePage`, `FooterPage`, `LoginPage`).
- **RULE-203:** Use **consistent naming conventions**, such as camelCase for methods and properties, and PascalCase for class names.

---

## Patterns & Anti-Patterns

### ✅ Do This

```javascript
import { Page } from './page.js'
import { $ } from '@wdio/globals'

class HomePage extends Page {
  open() {
    return super.open('/')
  }

  get signInLink() {
    return $('a[href*="/sign-in"]')
  }

  get gatewayRadioButton() {
    return $('input[id="authProvider-2"]')
  }

  get chooseSignInButton() {
    return $('form[action="/sign-in-choose"] button')
  }

  get signInBasedOnTestEmail() {
    return $('//tr[th[text()="muddin@equalexperts.com"]]//td//a')
  }

  async login() {
    return await this.clickLink(this.signInLink)
  }

  async gatewayLogin() {
    await this.clickLink(this.gatewayRadioButton)
    return await this.clickLink(this.chooseSignInButton)
  }

  async loginRegisteredUser() {
    return await this.clickLink(this.signInBasedOnTestEmail)
  }
}

export default new HomePage()
```

**Why it’s good:**

- Encapsulates all page-specific selectors and behaviors
- Follows inheritance pattern via `Page` base class
- Provides meaningful, reusable, asynchronous methods
- Keeps business logic out of test scripts

---

### ❌ Don’t Do This

```javascript
class HomePage {
  async login() {
    await $('a[href*="/sign-in"]').click()
    expect(await browser.getUrl()).toContain('/sign-in') // ❌ Assertion in page object
  }

  async gatewayLogin() {
    await browser.url('/') // ❌ Direct navigation inside action
    await $('input[id="authProvider-2"]').click()
  }
}
```

**Why it’s bad:**

- Assertions mixed with page actions
- Hard-coded selectors inside methods
- No inheritance or reuse via `Page` base class
- Test logic leaking into page layer

---

## Decision Framework

**When rules conflict:**

1. Favor **readability and maintainability** over minor performance optimizations.
2. Prefer **abstraction** (via base class or helper methods) if code is reused across multiple pages.
3. Default to **test isolation** — page objects should never depend on each other’s internal state.

**When facing edge cases:**

- Use component-level page objects for sections reused across multiple pages (e.g., headers, footers, modals).
- Avoid chaining unrelated page objects.
- Use composition over inheritance when combining shared functionality from multiple sources.

---

## Exceptions & Waivers

**Valid reasons for exceptions:**

- Temporary selectors for elements under active redesign.
- Experimental or prototype UI tests where structure is evolving.
- Vendor-controlled pages (e.g., OAuth login or payment gateways).

**Process for exceptions:**

1. Document the exception in the test file with a clear justification (`// EXCEPTION: reason`).
2. Review exception during pull request.
3. Revisit and remove exceptions once the page stabilizes.

---

## Quality Gates

- **Automated checks:**

  - Lint rule to enforce getters for selectors.
  - Static analysis to detect `expect()` or `assert` usage in page objects.

- **Code review focus:**

  - Confirm page objects contain no assertions or direct navigation unless explicitly part of `open()`.
  - Validate proper use of `super.open()` for consistent navigation.
  - Verify naming consistency and adherence to async conventions.

- **Testing requirements:**
  - Each public page object method should be covered by at least one test.
  - Validate selectors through smoke or sanity tests.

---

## Related Rules - add to line 172

- `rules/spec-test-rules.md` – Defines test file organization and separation of test logic from page behavior.

## References

- [SeleniumHQ - Page Object Design Pattern](https://www.selenium.dev/documentation/test_practices/encouraged/page_object_models/)
- [WebdriverIO - Page Objects](https://webdriver.io/docs/pageobjects)
- [Martin Fowler - Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)

---

## TL;DR

**Key Principles:**

- Encapsulate, abstract, and maintain — each page object should expose behavior, not details.
- Keep logic focused on interactions, not assertions.
- Use a shared base `Page` for consistency.

**Critical Rules:**

- Must represent one logical page/component.
- Must use getters for all selectors.
- Must not include assertions or navigation logic beyond `open()`.

**Quick Decision Guide:**
👉 When in doubt:  
“If it’s _what the user does_, it belongs in the Page Object.  
If it’s _what the test verifies_, it belongs in the test.”
