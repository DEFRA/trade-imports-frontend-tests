import { request } from 'undici'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

export async function sendCdsMessageFromFile(
  relativePath,
  isFinalised = false
) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const soapFilePath = path.resolve(__dirname, relativePath)
  const soapEnvelope = await readFile(soapFilePath, 'utf-8')
  await new Promise((resolve) => setTimeout(resolve, 500))
  return await sendSoapRequest(soapEnvelope, isFinalised)
}

export async function sendSoapRequest(
  soapEnvelope,
  isFinalised = false,
  retryOptions = {}
) {
  let url

  if (!isFinalised) {
    if (process.env.ENVIRONMENT === 'local') {
      url = `http://localhost:8080/ITSW/CDS/SubmitImportDocumentCDSFacadeService`
    } else {
      url = `https://btms-gateway.api.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/ITSW/CDS/SubmitImportDocumentCDSFacadeService`
    }
  } else {
    if (process.env.ENVIRONMENT === 'local') {
      url = `http://localhost:8080/ITSW/CDS/NotifyFinalisedStateCDSFacadeService`
    } else {
      url = `https://btms-gateway.api.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/ITSW/CDS/NotifyFinalisedStateCDSFacadeService`
    }
  }

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
        headers: { 'Content-Type': 'application/xml' },
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
