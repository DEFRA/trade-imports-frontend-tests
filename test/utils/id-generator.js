//  - MRN:  ^[1-9]{2}[A-Za-z]{2}[A-Za-z0-9]{14}$
//  - GMR:  ^GMR[A-Z][0-9A-Z]{8}$
//  - CHED: CHED([ADP]|P{2}).GB.2\d{3}.\d{7,8}[VR]?
//  - DUCR: \dGB\d{12}-[0-9A-Z()-]{1,19}
//  - VRN:  ^[A-Z0-9-](?:[A-Z0-9 -]{1,30})?$
//  - TRN:  ^[A-Z0-9-](?:[A-Z0-9 -]{1,199})?$

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

const generateChedOf = (prefix) =>
  `${prefix}.GB.2${str(DIGITS, 3)}.${str(DIGITS, 7)}`
export const generateChed = () => generateChedOf('CHEDA')
export const generateChedP = () => generateChedOf('CHEDP')
export const generateChedPp = () => generateChedOf('CHEDPP')

export const generateDucr = () =>
  `4GB${str(DIGITS, 12)}-PORTACDMS${str(ALNUM, 6)}`

export const generateVrn = () => str(ALNUM, 2) + ' ' + str(ALNUM, 3)

export const generateTrn = () =>
  str(ALNUM, 4) + ' ' + str(ALNUM, 4) + ' ' + str(ALNUM, 4)

export const generateCorrelationId = () => `CDM${str(ALNUM, 10)}`
