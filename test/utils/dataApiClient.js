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

const makeRequest = async (fetchRequest) => {
  const resp = await fetchRequest
  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`HTTP ${resp.status} ${resp.statusText}: ${body}`)
  }
  return resp
}

export async function dataApiClientRequest(url, params) {
  const req = fetch(url, {
    ...params,
    headers: dataApiHeaders()
  })

  return makeRequest(req)
}

export async function dataApiClientGetMaxId() {
  const resp = await dataApiClientRequest(`${dataApiBaseUrl}/admin/max-id`, {
    method: 'GET'
  })

  return resp.json()
}

export async function dataApiClientGetRelatedDeclarations(mrn) {
  const resp = await dataApiClientRequest(
    `${dataApiBaseUrl}/related-import-declarations?mrn=${encodeURIComponent(mrn)}`,
    {
      method: 'GET'
    }
  )

  return resp.json()
}
