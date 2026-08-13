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

export async function processorPostMatchedGmrFromFile(relativePath) {
  assertCredentials()
  globalThis.testLogger.info({
    event: '[GMR] About to send a matched GMR message from file',
    relativePath
  })
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const filePath = path.resolve(__dirname, relativePath)
  const fileContent = await readFile(filePath, 'utf-8')
  const json = JSON.parse(fileContent)

  const declarationIds = [
    ...(json.declarations?.customs ?? []),
    ...(json.declarations?.transits ?? [])
  ].map((d) => d.id)

  const results = []
  for (const mrn of declarationIds) {
    results.push(await processorPostMatchedGmr({ mrn, gmr: json }))
  }
  return results
}
