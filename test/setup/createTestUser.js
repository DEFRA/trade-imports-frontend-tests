import HomePage from '../page-objects/home.page'
import { $ } from '@wdio/globals'

const testUser = {
  email: 'front-end-tests@testexample.com',
  firstName: 'fName',
  lastName: 'lName',
  enrolmentCount: '1',
  enrolmentRequestCount: '1',
  relationshipId: 'REL12345',
  organisationId: 'e852b6d3-5f5e-4b90-9932-c2e2350d1099',
  organisationName: 'Equal Experts'
}

export async function ensureTestUserExists() {
  const emailRow = await HomePage.signInBasedOnTestEmail
  const exists = await emailRow.isExisting()
  if (!exists) {
    await createTestUser(testUser)
  }
}

async function createTestUser(user) {
  const registrationLink = await $(
    'a.govuk-link[href="/cdp-defra-id-stub/register"]'
  )
  await registrationLink.click()

  // Fill registration form
  await $('#email').setValue(user.email)
  await $('#firstName').setValue(user.firstName)
  await $('#lastName').setValue(user.lastName)
  await $('#enrolmentCount').setValue(user.enrolmentCount)
  await $('#enrolmentRequestCount').setValue(user.enrolmentRequestCount)
  await $('button[type="submit"].govuk-button').click() // Continue button

  // Fill relationship form
  await $('#relationshipId').setValue(user.relationshipId)
  await $('#organisationId').setValue(user.organisationId)
  await $('#organisationName').setValue(user.organisationName)
  await $('button[type="submit"].govuk-button').click() // Add relationship button

  // Finish setup
  const finishLink = await $(
    'a.govuk-link[href*="/cdp-defra-id-stub/register/"][href$="/summary"]'
  )
  await finishLink.click()

  // Navigate back to login page
  await HomePage.open()
  await HomePage.login()
  await HomePage.gatewayLogin()
}
