import { ProxyAgent, request } from 'undici'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import crypto from 'crypto'

export async function sendIpaffMessageFromFile(relativePath) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const filePath = path.resolve(__dirname, relativePath)
  const fileContent = await readFile(filePath, 'utf-8')
  const json = JSON.parse(fileContent)
  return await sendIpaffsMessage(json)
}

export async function sendIpaffsMessage(json) {
  const proxy = process.env.CDP_HTTPS_PROXY

  let proxyAgent

  const url = `https://${process.env.ENVIRONMENT}treinfsb1001.servicebus.windows.net/defra.trade.imports.notification-topic/messages`

  const accessToken = createSharedAccessToken(
    `https://${process.env.ENVIRONMENT}treinfsb1001.servicebus.windows.net/defra.trade.imports.notification-topic`,
    'trade-imports',
    process.env.IPAFFS_KEY
  )

  const body = typeof json === 'object' ? JSON.stringify(json) : json

  if (proxy) {
    proxyAgent = new ProxyAgent({ uri: proxy })
    try {
      const response = await request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          Authorization: accessToken
        },
        body,
        dispatcher: proxyAgent
      })

      return response
    } catch (err) {
      throw new Error(`request failed: ${err.message || err}`)
    }
  } else {
    try {
      const response = await request(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/xml',
          Authorization: accessToken
        },
        body,
        dispatcher: proxyAgent
      })

      return response
    } catch (err) {
      throw new Error(`request failed: ${err.message || err}`)
    }
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
