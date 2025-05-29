import { request } from 'undici'

export async function sendSoapRequest(soapEnvelope) {
  const url = `https://btms-gateway.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/ITSW/CDS/SubmitImportDocumentCDSFacadeService`

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
