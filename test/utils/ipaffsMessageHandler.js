import { request } from 'undici'
import crypto from 'crypto'

export async function sendIpaffsMessage(json) {
  const url = `https://${process.env.ENVIRONMENT}treinfsb1001.servicebus.windows.net/defra.trade.imports.notification-topic/messages`

  const accessToken = createSharedAccessToken(
    `https://${process.env.ENVIRONMENT}treinfsb1001.servicebus.windows.net/defra.trade.imports.notification-topic`,
    'trade-imports',
    process.env.IPAFFS_KEY
  )

  const body = typeof json === 'object' ? JSON.stringify(json) : json

  try {
    const response = await request(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
        Authorization: accessToken
      },
      body
    })

    return response
  } catch (err) {
    throw new Error(`request failed: ${err.message || err}`)
  }
}

function createSharedAccessToken(uri, saName, saKey) {
  if (!uri || !saName || !saKey) {
    throw new Error('Missing required parameter')
  }

  const encodedUri = encodeURIComponent(uri)
  const ttl = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7
  const stringToSign = `${encodedUri}\n${ttl}`
  const hmac = crypto.createHmac('sha256', saKey)
  hmac.update(stringToSign)
  const signature = encodeURIComponent(hmac.digest('base64'))

  return `SharedAccessSignature sr=${encodedUri}&sig=${signature}&se=${ttl}&skn=${saName}`
}
