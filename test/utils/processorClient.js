import { v4 as uuidv4 } from 'uuid'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import './logger.js'

const baseUrl =
  process.env.BASE_URL_TRADE_IMPORTS_PROCESSOR ??
  `https://trade-imports-processor.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`

const withHeaders = (headers) => ({
  Authorization:
    'Basic ' +
    Buffer.from(
      `${process.env.TRADE_IMPORTS_PROCESSOR_USER}:${process.env.TRADE_IMPORTS_PROCESSOR_KEY}`
    ).toString('base64'),
  'Content-Type': 'application/json',
  ...(process.env.CDP_API_KEY ? { 'X-API-Key': process.env.CDP_API_KEY } : {}),
  ...headers
})

const makeRequest = async (fetchRequest) => {
  const resp = await fetchRequest
  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`HTTP ${resp.status} ${resp.statusText}: ${body}`)
  }
  return resp
}

const assertCredentials = () => {
  if (
    !process.env.TRADE_IMPORTS_PROCESSOR_USER ||
    !process.env.TRADE_IMPORTS_PROCESSOR_KEY
  ) {
    throw new Error(
      'Request failed: TRADE_IMPORTS_PROCESSOR_USER and TRADE_IMPORTS_PROCESSOR_KEY must be set'
    )
  }
}

const dataApiBaseUrl =
  process.env.BASE_URL_TRADE_IMPORTS_DATA_API ??
  `https://trade-imports-data-api.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`

const dataApiHeaders = () => ({
  Authorization:
    'Basic ' +
    Buffer.from(
      `${process.env.TRADE_IMPORTS_DATA_API_USER}:${process.env.TRADE_IMPORTS_DATA_API_KEY}`
    ).toString('base64'),
  ...(process.env.CDP_API_KEY ? { 'X-API-Key': process.env.CDP_API_KEY } : {})
})

export async function waitForDeclaration(mrn, timeoutMs = 20000) {
  globalThis.testLogger?.info?.({
    event: 'Waiting for declaration',
    mrn
  })
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    const resp = await fetch(
      `${dataApiBaseUrl}/related-import-declarations?mrn=${encodeURIComponent(mrn)}`,
      { headers: dataApiHeaders() }
    )
    if (resp.ok) {
      const body = await resp.json()
      if ((body.customsDeclarations || []).length > 0) return
    } else {
      globalThis.testLogger?.info?.({
        event: 'Declaration not yet found',
        mrn
      })
    }
    await new Promise((resolve) => setTimeout(resolve, 1000))
  }
  throw new Error(`Could not find declaration ${mrn} after ${timeoutMs}ms`)
}

export async function processorPostMatchedGmr(matchedGmr, traceId) {
  assertCredentials()
  const resolvedTraceId = traceId ?? uuidv4().replace(/-/g, '')

  globalThis.testLogger.info({
    event: '[GMR] About to POST matched GMR to processor',
    traceId: resolvedTraceId,
    url: `${baseUrl}/dev/matched-gmrs`
  })

  const req = fetch(`${baseUrl}/dev/matched-gmrs`, {
    method: 'POST',
    body: JSON.stringify(matchedGmr),
    headers: withHeaders({ 'x-cdp-request-id': resolvedTraceId })
  })

  const response = await makeRequest(req)
  globalThis.testLogger.info({
    event: '[GMR] Successfully POSTed matched GMR to processor',
    traceId: resolvedTraceId,
    status: response.status
  })
  return { traceId: resolvedTraceId, response }
}

/**
 * `gmrId`     -> json.gmrId
 * `customs`   -> json.declarations.customs[].id
 * `transits`  -> json.declarations.transits[].id
 * `vrn`       -> json.vehicleRegNum
 * `trns`      -> json.trailerRegistrationNums
 */
export async function processorPostMatchedGmrFromFile(relativePath, subs = {}) {
  assertCredentials()
  globalThis.testLogger.info({
    event: '[GMR] About to send a matched GMR message from file',
    relativePath
  })
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const filePath = path.resolve(__dirname, relativePath)
  const json = JSON.parse(await readFile(filePath, 'utf-8'))

  if (subs.gmrId) json.gmrId = subs.gmrId
  if (subs.vrn) json.vehicleRegNum = subs.vrn
  if (Array.isArray(subs.trns) && Array.isArray(json.trailerRegistrationNums)) {
    json.trailerRegistrationNums.forEach((t, i) => {
      if (subs.trns[i]) json.trailerRegistrationNums[i] = subs.trns[i]
    })
  }

  if (
    Array.isArray(subs.customs) &&
    Array.isArray(json.declarations?.customs)
  ) {
    json.declarations.customs.forEach((d, i) => {
      if (subs.customs[i]) d.id = subs.customs[i]
    })
  }
  if (
    Array.isArray(subs.transits) &&
    Array.isArray(json.declarations?.transits)
  ) {
    json.declarations.transits.forEach((d, i) => {
      if (subs.transits[i]) d.id = subs.transits[i]
    })
  }

  const declarationIds = [
    ...(json.declarations?.customs ?? []),
    ...(json.declarations?.transits ?? [])
  ].map((d) => d.id)

  const results = []
  for (const mrn of declarationIds) {
    results.push(await processorPostMatchedGmr({ mrn, gmr: json }))
  }
  return { declarationIds, results }
}
