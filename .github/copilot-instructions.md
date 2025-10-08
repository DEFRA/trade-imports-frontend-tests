# GitHub Copilot Project Instructions — WebdriverIO Automation

Defines the **standards, conventions, and rules** for generating and maintaining Page Object Model (POM) classes and UI/E2E test specifications within this WebdriverIO project.

These instructions ensure that Copilot generates maintainable, consistent, and scalable test automation code aligned with team conventions.

---

## Overview

**Applies to:** WebdriverIO UI automation project  
**Audience:** Test Automation Developers, QA Engineers, and Developers writing E2E/UI tests  
**Scope:**

- Page Object creation (`test/page-objects`)
- Spec/Test creation (`test/specs`)

---

## 🔹 Section 1 — Page Object Generation Rules

### Context

Page Objects encapsulate the structure and behavior of a page or component within a UI test suite. They abstract interactions away from the tests themselves, enabling reuse and reducing brittleness when the UI changes.

**Location:** `trade-imports-frontend-tests/test/page-objects`

---

### Core Principles

1. **Encapsulation:** Each page object must encapsulate the locators and actions of a single page or component to reduce duplication and increase reusability.
2. **Abstraction:** Page objects must hide the technical details of selectors and DOM operations from test scripts, providing clear, high-level business actions.
3. **Maintainability:** The design must minimize impact from UI changes by localizing selectors and logic in one place.

---

### Must-Have Rules (Critical)

- **RULE-001:** Each page object must represent **a single logical page or reusable component**, not multiple unrelated pages.
- **RULE-002:** All selectors must be defined as **getters**, not hard-coded inside methods. This ensures reusability and consistency.
- **RULE-003:** Page objects must not include **assertions or test logic**. Validation belongs in test files, not in page objects.

---

### Should-Have Rules (Important)

- **RULE-101:** Methods should represent **high-level user actions** (e.g., `login()`, `navigateToSettings()`) rather than low-level DOM interactions.
- **RULE-102:** All methods should be **asynchronous** (using `async/await`) to handle promises from browser actions cleanly.
- **RULE-103:** Extend a common **base `Page` class** (e.g., `Page.js`) that provides shared functionality like navigation, waits, or utility methods.

---

### Could-Have Rules (Preferred)

- **RULE-201:** Use **semantic names** for selectors and methods reflecting user intent, not UI implementation details.
- **RULE-202:** Group related elements or actions logically (e.g., `HomePage`, `FooterPage`, `LoginPage`).
- **RULE-203:** Use **consistent naming conventions**, such as camelCase for methods and properties, and PascalCase for class names.

---

### ✅ Example (Good)

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

  async login() {
    return await this.clickLink(this.signInLink)
  }

  async gatewayLogin() {
    await this.clickLink(this.gatewayRadioButton)
    return await this.clickLink(this.chooseSignInButton)
  }
}

export default new HomePage()
```

**Why it’s good:**

- Encapsulates all page-specific selectors and behaviors
- Follows inheritance pattern via `Page` base class
- Provides meaningful, reusable, asynchronous methods
- Keeps business logic out of test scripts

### ❌ Example (Bad)

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

### Decision Framework

1. Favor **readability and maintainability** over minor performance optimizations.
2. Prefer **abstraction** (via base class or helper methods) if code is reused across multiple pages.
3. Default to **test isolation** — page objects should never depend on each other’s internal state.

**When facing edge cases:**

- Use component-level page objects for sections reused across multiple pages (e.g., headers, footers, modals).
- Avoid chaining unrelated page objects.
- Use composition over inheritance when combining shared functionality from multiple sources.

---

### Exceptions & Waivers

**Valid reasons for exceptions:**

- Temporary selectors for elements under active redesign.
- Experimental or prototype UI tests where structure is evolving.
- Vendor-controlled pages (e.g., OAuth login or payment gateways).

**Process for exceptions:**

1. Document the exception in the test file with a clear justification (`// EXCEPTION: reason`).
2. Review exception during pull request.
3. Revisit and remove exceptions once the page stabilizes.

---

### Quality Gates

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

### Related Rules

- See **Spec Test Rules** below.

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

---

## 🔹 Section 2 — Spec Test Rules

### Context

These rules apply to all automated test suites that verify user behavior through browser interactions using frameworks such as **WebdriverIO**, **Playwright**, or **Cypress**. The focus is on clean, maintainable test specifications that leverage page objects rather than direct DOM manipulation.

**Location:** `trade-imports-frontend-tests/test/specs`

---

### Core Principles

1. **Readability:** Tests must clearly describe user intent and expected outcomes. A non-technical stakeholder should be able to understand what is being verified.
2. **Reusability:** All interaction logic should reside in Page Objects, not the test files themselves.
3. **Stability:** Tests should be deterministic, resistant to timing issues, and avoid flaky behavior through proper waiting strategies and consistent assertions.

---

### Must-Have Rules (Critical)

- **RULE-001:** Tests must use **Page Objects** for all interactions with the UI. Direct selectors or element references are not allowed in test files.
- **RULE-002:** Each test must contain **at least one assertion** using `expect()` to validate behavior or outcome.
- **RULE-003:** Each test should be **isolated and self-contained**, not dependent on another test's outcome or state.

---

### Should-Have Rules (Important)

- **RULE-101:** Use clear, behavior-driven naming conventions for test cases (e.g., `'should display login form when clicking sign in'`).
- **RULE-102:** Use `beforeEach` or helper functions for setup and navigation when repeated across multiple tests.
- **RULE-103:** Always use `async/await` syntax to handle asynchronous browser commands and assertions cleanly.

---

### Could-Have Rules (Preferred)

- **RULE-201:** Group related tests within `describe` blocks for logical organization.
- **RULE-202:** Use **constants** or **fixtures** for static data instead of hardcoding values inside tests.
- **RULE-203:** Include meaningful comments only when necessary to clarify intent, not to restate what’s already clear from the code.

---

### ✅ Example (Good)

```javascript
import { browser, expect } from '@wdio/globals'
import HomePage from '../page-objects/home.page'

describe('Home page', () => {
  it('should display the correct title', async () => {
    await HomePage.open()
    await expect(browser).toHaveTitle(
      'Border Trade Matching Service - Border Trade Matching Service'
    )
  })

  it('should allow user to log in via gateway', async () => {
    await HomePage.login()
    await HomePage.gatewayLogin()
    await expect(browser).toHaveTitle('DEFRA ID Login | cdp-defra-id-stub')
  })
})
```

**Why it’s good:**

- Uses Page Object methods exclusively for actions
- Clear, readable test names that describe behavior
- Clean separation between setup, action, and assertion
- Assertions validate observable outcomes, not internal state

### ❌ Example (Bad)

```javascript
describe('Home page', () => {
  it('login test', async () => {
    await browser.url('/') // ❌ Direct navigation
    await $('a[href*="/sign-in"]').click() // ❌ Selector in test
  })
})
```

**Why it’s bad:**

- Direct element selectors instead of using Page Objects
- Poor test naming (`login test` is vague)
- Breaks abstraction and increases maintenance overhead
- Hard to read and reason about

---

### Decision Framework

1. Prioritize **readability** over technical brevity. Tests are documentation first, automation second.
2. When in doubt, extract common logic to the **Page Object** layer or a shared helper.
3. Always prefer consistency with existing test conventions in the project.

**When facing edge cases:**

- For dynamic content, use waits (e.g., `waitUntil`, `waitForDisplayed`) within Page Objects.
- For experimental features, tag tests accordingly (e.g., `@wip`, `@experimental`).
- Avoid conditional logic in tests—handle branching behavior in Page Objects.

---

### Exceptions & Waivers

**Valid reasons for exceptions:**

- One-time setup scripts (non-reusable logic).
- Prototype or spike testing for exploratory purposes.
- Emergency smoke tests during critical releases.

**Process for exceptions:**

1. Document the reason in the test file with a comment (`// EXCEPTION: reason`).
2. Review exception during pull request.
3. Remove or refactor exceptions once the scenario stabilizes.

---

### Quality Gates

- **Automated checks:**

  - Linter rules enforcing async/await usage.
  - ESLint or custom checks for `expect()` presence.
  - Static checks ensuring imports reference Page Objects only.

- **Code review focus:**

  - Verify tests use descriptive names and structure.
  - Confirm Page Object usage for all interactions.
  - Ensure assertions reflect expected business outcomes.

- **Testing requirements:**
  - Smoke, regression, and functional suites should each adhere to these conventions.
  - All tests must run independently without relying on prior execution order.

---

### Related Rules

- See **Page Object Rules** above.

**Critical Rules:**

- Must use Page Objects for actions.
- Must include at least one `expect()` per test.
- Must not chain tests together.

**Quick Decision Guide:**
👉 When in doubt:  
“If it’s **about what the user sees or experiences**, assert it here.  
If it’s **about how it happens**, move it to the Page Object.”

---

## 🔹 Section 3 — Shared Quality and Governance

- Both Page Objects and Specs should be peer-reviewed for rule compliance.
- Maintain naming consistency and folder structure.
- Use CI checks (lint, static analysis, smoke tests) to enforce standards.

---

## TL;DR

| Area         | Must                            | Should                    | Should Not         |
| ------------ | ------------------------------- | ------------------------- | ------------------ |
| Page Objects | Encapsulate selectors & actions | Extend base Page          | Contain assertions |
| Tests        | Use Page Objects                | Readable, async, isolated | Use raw selectors  |
| Both         | Maintain async consistency      | Follow naming conventions | Mix logic layers   |

---

### Quick Decision Guides

**Page Object:**

> “If it’s _what the user does_, put it in the Page Object.”

**Test Spec:**

> “If it’s _what the user sees or expects_, assert it in the test.”

---

## References

- [WebdriverIO - Page Objects](https://webdriver.io/docs/pageobjects)
- [WebdriverIO - Writing Tests](https://webdriver.io/docs/api)
- [SeleniumHQ Best Practices](https://www.selenium.dev/documentation/test_practices/encouraged/)
- [Martin Fowler - Page Object Pattern](https://martinfowler.com/bliki/PageObject.html)
- [Martin Fowler - Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)
