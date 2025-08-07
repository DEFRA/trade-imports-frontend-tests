import { ServiceBusClient } from '@azure/service-bus'
import { v4 as uuidv4 } from 'uuid'
import { WebSocket } from 'ws'
import proxyAgent from 'proxy-agent'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

export async function sendIpaffMessageFromFile(relativePath) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const filePath = path.resolve(__dirname, relativePath)
  const fileContent = await readFile(filePath, 'utf-8')
  const json = JSON.parse(fileContent)
  return await sendIpaffsMessage(json)
}

export async function sendIpaffsMessage(json) {
  const connectionString =
    process.env.ServiceBus__Notifications__ConnectionString

  const queueOrTopicName = connectionString.match(/EntityPath=([^;]+)/)[1]

  const body = typeof json === 'object' ? JSON.stringify(json) : json

  let sbClient
  if (globalThis.proxy) {
    const agent = proxyAgent(globalThis.proxy)

    sbClient = new ServiceBusClient(connectionString, {
      webSocketOptions: {
        webSocket: WebSocket,
        webSocketConstructorOptions: {
          agent
        }
      }
    })
  } else {
    sbClient = new ServiceBusClient(connectionString)
  }

  const sender = sbClient.createSender(queueOrTopicName)

  const requestId = uuidv4().replace(/-/g, '')

  const message = {
    body: json,
    applicationProperties: {
      'x-cdp-request-id': requestId
    }
  }

  try {
    await sender.sendMessages(message)

    return {
      requestId,
      ipaffsBody: body,
      success: true,
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    throw new Error(`Request failed: ${err.message || err}`)
  } finally {
    try {
      await sender.close()
    } catch (closeErr) {}

    try {
      await sbClient.close()
    } catch (closeErr) {}
  }
}
