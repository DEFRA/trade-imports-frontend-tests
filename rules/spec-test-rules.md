# Spec Test Rules

Defines standards and best practices for writing **UI and E2E test specifications** using the Page Object Model (POM). These rules govern how test files (`.spec.js`, `.spec.ts`) should be structured, written, and maintained for clarity, reliability, and scalability.

---

## Context

These rules apply to all automated test suites that verify user behavior through browser interactions using frameworks such as **WebdriverIO**, **Playwright**, or **Cypress**. The focus is on clean, maintainable test specifications that leverage page objects rather than direct DOM manipulation.

**Applies to:** UI/E2E test suites using the Page Object Model  
**Level:** Tactical  
**Audience:** QA Engineers, Automation Developers, and Developers writing automated UI tests

---

## Core Principles

1. **Readability:** Tests must clearly describe user intent and expected outcomes. A non-technical stakeholder should be able to understand what is being verified.
2. **Reusability:** All interaction logic should reside in Page Objects, not the test files themselves.
3. **Stability:** Tests should be deterministic, resistant to timing issues, and avoid flaky behavior through proper waiting strategies and consistent assertions.
4. **Location:** Tests should be created **trade-imports-frontend-tests/test/specs**

---

## Rules

### Must Have (Critical)

- **RULE-001:** Tests must use **Page Objects** for all interactions with the UI. Direct selectors or element references are not allowed in test files.
- **RULE-002:** Each test must contain **at least one assertion** using `expect()` to validate behavior or outcome.
- **RULE-003:** Each test should be **isolated and self-contained**, not dependent on another test's outcome or state.

---

### Should Have (Important)

- **RULE-101:** Use clear, behavior-driven naming conventions for test cases (e.g., `'should display login form when clicking sign in'`).
- **RULE-102:** Use `beforeEach` or helper functions for setup and navigation when repeated across multiple tests.
- **RULE-103:** Always use `async/await` syntax to handle asynchronous browser commands and assertions cleanly.

---

### Could Have (Preferred)

- **RULE-201:** Group related tests within `describe` blocks for logical organization.
- **RULE-202:** Use **constants** or **fixtures** for static data instead of hardcoding values inside tests.
- **RULE-203:** Include meaningful comments only when necessary to clarify intent, not to restate what’s already clear from the code.

---

## Patterns & Anti-Patterns

### ✅ Do This

```javascript
import { browser, expect } from '@wdio/globals'
import HomePage from 'page-objects/home.page'

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

---

### ❌ Don’t Do This

```javascript
describe('Home page', () => {
  it('login test', async () => {
    await browser.url('/') // ❌ Direct navigation in test instead of Page.open()
    await $('a[href*="/sign-in"]').click() // ❌ Selector directly in test
    expect(await browser.getUrl()).toContain('/sign-in') // ❌ Mixed assertion logic
  })
})
```

**Why it’s bad:**

- Direct element selectors instead of using Page Objects
- Poor test naming (`login test` is vague)
- Breaks abstraction and increases maintenance overhead
- Hard to read and reason about

---

## Decision Framework

**When rules conflict:**

1. Prioritize **readability** over technical brevity. Tests are documentation first, automation second.
2. When in doubt, extract common logic to the **Page Object** layer or a shared helper.
3. Always prefer consistency with existing test conventions in the project.

**When facing edge cases:**

- For dynamic content, use waits (e.g., `waitUntil`, `waitForDisplayed`) within Page Objects.
- For experimental features, tag tests accordingly (e.g., `@wip`, `@experimental`).
- Avoid conditional logic in tests—handle branching behavior in Page Objects.

---

## Exceptions & Waivers

**Valid reasons for exceptions:**

- One-time setup scripts (non-reusable logic).
- Prototype or spike testing for exploratory purposes.
- Emergency smoke tests during critical releases.

**Process for exceptions:**

1. Document the reason in the test file with a comment (`// EXCEPTION: reason`).
2. Review exception during pull request.
3. Remove or refactor exceptions once the scenario stabilizes.

---

## Quality Gates

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

## Related Rules

- `rules/page-object-rules.md` – Defines standards for creating and maintaining Page Objects.

---

## References

- [WebdriverIO - Writing Tests](https://webdriver.io/docs/api)
- [SeleniumHQ - Test Structure Best Practices](https://www.selenium.dev/documentation/test_practices/encouraged/)
- [Martin Fowler - Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html)

---

## TL;DR

**Key Principles:**

- Tests describe user behavior and expectations, not implementation details.
- Use Page Objects for all interactions.
- Keep tests readable, maintainable, and deterministic.

**Critical Rules:**

- Must use Page Objects for actions.
- Must include at least one `expect()` per test.
- Must not chain tests together.

**Quick Decision Guide:**
👉 When in doubt:  
“If it’s **about what the user sees or experiences**, assert it here.  
If it’s **about how it happens**, move it to the Page Object.”
