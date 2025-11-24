import { request } from 'undici'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

export async function sendCdsMessageFromFile(
  relativePath,
  isFinalised = false
) {
  await new Promise((resolve) => setTimeout(resolve, 2000))
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const soapFilePath = path.resolve(__dirname, relativePath)
  const soapEnvelope = await readFile(soapFilePath, 'utf-8')
  return await sendSoapRequest(soapEnvelope, isFinalised)
}

export async function sendSoapRequest(soapEnvelope, isFinalised = false) {
  let url

  if (!isFinalised) {
    if (process.env.ENVIRONMENT === 'local') {
      url = `http://localhost:8080/ITSW/CDS/SubmitImportDocumentCDSFacadeService`
    } else {
      url = `https://btms-gateway.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/ITSW/CDS/SubmitImportDocumentCDSFacadeService`
    }
  } else {
    if (process.env.ENVIRONMENT === 'local') {
      url = `http://localhost:8080/ITSW/CDS/NotifyFinalisedStateCDSFacadeService`
    } else {
      url = `https://btms-gateway.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/ITSW/CDS/NotifyFinalisedStateCDSFacadeService`
    }
  }

  try {
    const response = await request(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/xml' },
      body: soapEnvelope
    })

    if (response.statusCode !== 200) {
      const bodyText = await response.body.text()
      throw new Error(
        `BTMS Gateway returned status ${response.statusCode}: ${bodyText}`
      )
    }

    await response.body.text()
    return response
  } catch (err) {
    throw new Error(`SOAP request failed: ${err.message || err}`)
  }
}
