//  - MRN:  ^[1-9]{2}[A-Za-z]{2}[A-Za-z0-9]{14}$
//  - GMR:  ^GMR[A-Z][0-9A-Z]{8}$
//  - CHED: CHED([ADP]|P{2}).GB.2\d{3}.\d{7,8}[VR]?
//  - DUCR: \dGB\d{12}-[0-9A-Z()-]{1,19}
//  - VRN:  ^[A-Z0-9-](?:[A-Z0-9 -]{1,30})?$
//  - TRN:  ^[A-Z0-9-](?:[A-Z0-9 -]{1,199})?$

import { dataApiClientGetMaxId } from './dataApiClient.js'

const DIGITS = '0123456789'
const NON_ZERO = '123456789'
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const ALNUM = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

const pick = (set) => set[Math.floor(Math.random() * set.length)]
const str = (set, n) => {
  let out = ''
  for (let i = 0; i < n; i++) out += pick(set)
  return out
}

export const generateMrn = () =>
  str(NON_ZERO, 2) + str(LETTERS, 2) + str(ALNUM, 14)

export const generateGmr = () => `GMR${pick(LETTERS)}${str(ALNUM, 8)}`

const CHED_MAX_NUMBER = 99999999
const MAX_EXPECTED_CHEDS_PER_SPEC = 20 // cds-status has 13 cheds in it
const MAX_EXPECTED_SPECS = 30 // each spec runs the various browsers simultaneously, so this tries to avoid conflicts
let chedInitPromise
let chedNextSuffix
let chedsGenerated = 0

const fetchMaxChedSuffix = async () => {
  const { importPreNotification } = await dataApiClientGetMaxId()
  return Number(importPreNotification?.match(/(\d{7,8})[VR]?$/i)?.[1] ?? 0)
}

const generateChedNumbers = async () => {
  const maxChedSuffix = await fetchMaxChedSuffix()
  const [browserIndex, sessionIndex] = (process.env.WDIO_WORKER_ID ?? '0-0')
    .split('-')
    .map(Number)

  // Each browser running the specs is allocated its own slice of references
  const start =
    Math.max(maxChedSuffix + 1, 1000000) +
    ((browserIndex || 0) * MAX_EXPECTED_SPECS + (sessionIndex || 0)) *
      MAX_EXPECTED_CHEDS_PER_SPEC

  // Check if we can fit in all the CHEDs we want before we hit the limit
  if (start + MAX_EXPECTED_CHEDS_PER_SPEC - 1 > CHED_MAX_NUMBER) {
    throw new Error(
      `We've run out of CHEDs - time to clear the database (slice starts at ${start})`
    )
  }

  chedNextSuffix = start
}

const generateChedOf = async (prefix) => {
  chedInitPromise ??= generateChedNumbers()
  await chedInitPromise

  if (++chedsGenerated > MAX_EXPECTED_CHEDS_PER_SPEC) {
    throw new Error(
      `Run out of CHEDs to generate - MAX_EXPECTED_CHEDS_PER_SPEC exhausted`
    )
  }

  return `${prefix}.GB.2${str(DIGITS, 3)}.${String(chedNextSuffix++).padStart(7, '0')}`
}
export const generateChed = () => generateChedOf('CHEDA')
export const generateChedP = () => generateChedOf('CHEDP')
export const generateChedPp = () => generateChedOf('CHEDPP')

export const generateDucr = () =>
  `4GB${str(DIGITS, 12)}-PORTACDMS${str(ALNUM, 6)}`

export const generateVrn = () => str(ALNUM, 2) + ' ' + str(ALNUM, 3)

export const generateTrn = () =>
  str(ALNUM, 4) + ' ' + str(ALNUM, 4) + ' ' + str(ALNUM, 4)

export const generateCorrelationId = () => `CDM${str(ALNUM, 10)}`
