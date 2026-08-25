import { request } from 'undici'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const baseUrl =
  process.env.BASE_URL_BTMS_GATEWAY ??
  (process.env.ENVIRONMENT === 'local'
    ? 'http://localhost:8080'
    : `https://btms-gateway.api.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`)

const endpointPath = (isFinalised, isError) =>
  isFinalised
    ? '/ITSW/CDS/NotifyFinalisedStateCDSFacadeService'
    : isError
      ? '/ITSW/CDS/ALVSCDSErrorNotificationService'
      : '/ITSW/CDS/SubmitImportDocumentCDSFacadeService'

/**
 *  - `mrn`          -> the value in <EntryReference>
 *  - `ducr`         -> the value in <DeclarationUCR>
 *  - `correlationId`-> the value in <CorrelationId>
 *  - `ched`         -> the value in a single <DocumentReference>
 *  - `cheds`        -> the values in <DocumentReference> in document order
 */
const replaceAll = (text, from, to) => text.split(from).join(to)

const applySubstitutions = (xml, subs = {}) => {
  let out = xml

  const replaceFieldTag = (tag, value) => {
    const match = out.match(new RegExp(`<${tag}>([^<]+)</${tag}>`))
    if (match && value) {
      out = replaceAll(out, match[1], value)
    }
  }

  replaceFieldTag('EntryReference', subs.mrn)
  replaceFieldTag('DeclarationUCR', subs.ducr)
  replaceFieldTag('CorrelationId', subs.correlationId)
  replaceFieldTag('DocumentReference', subs.ched)

  if (Array.isArray(subs.cheds)) {
    const refs = [
      ...out.matchAll(/<DocumentReference>([^<]+)<\/DocumentReference>/g)
    ]
    refs.forEach((match, index) => {
      if (subs.cheds[index]) out = replaceAll(out, match[1], subs.cheds[index])
    })
  }
  return out
}

export async function sendCdsMessageFromFile(
  relativePath,
  subs = {},
  isFinalised = false,
  isError = false
) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const soapFilePath = path.resolve(__dirname, relativePath)
  const soapEnvelope = applySubstitutions(
    await readFile(soapFilePath, 'utf-8'),
    subs
  )
  await new Promise((resolve) => setTimeout(resolve, 500))
  return await sendSoapRequest(soapEnvelope, isFinalised, isError)
}

export async function sendSoapRequest(
  soapEnvelope,
  isFinalised = false,
  isError = false,
  retryOptions = {}
) {
  const url = `${baseUrl}${endpointPath(isFinalised, isError)}`

  const {
    timeoutMs = 15000,
    intervalMs = 300,
    fatalStatusCodes = [400, 401, 403, 404],
    maxAttempts = Math.ceil(timeoutMs / intervalMs)
  } = retryOptions

  const start = Date.now()
  let attempt = 0
  let lastError

  while (attempt < maxAttempts) {
    attempt++
    try {
      const response = await request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          ...(process.env.CDP_API_KEY
            ? { 'X-API-Key': process.env.CDP_API_KEY }
            : {})
        },
        body: soapEnvelope
      })

      if (response.statusCode === 200) {
        await response.body.text()
        return response
      }

      const bodyText = await response.body.text()
      if (fatalStatusCodes.includes(response.statusCode)) {
        throw new Error(
          `BTMS Gateway fatal status ${response.statusCode}: ${bodyText}`
        )
      }
      lastError = new Error(
        `Attempt ${attempt} non-200 (${response.statusCode}): ${bodyText}`
      )
    } catch (err) {
      lastError = new Error(
        `Attempt ${attempt} failed: ${err.message || String(err)}`
      )
      if (err.message && /fatal status/.test(err.message)) {
        throw lastError
      }
    }

    const elapsed = Date.now() - start
    if (elapsed + intervalMs >= timeoutMs) {
      break
    }
    await new Promise((resolve) => setTimeout(resolve, intervalMs))
  }

  throw new Error(
    `SOAP request did not succeed after ${attempt} attempts within ${timeoutMs}ms. Last error: ${lastError?.message}`
  )
}
