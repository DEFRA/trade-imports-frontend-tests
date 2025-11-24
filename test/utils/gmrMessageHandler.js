import { ServiceBusClient } from '@azure/service-bus'
import { v4 as uuidv4 } from 'uuid'
import { WebSocket } from 'ws'
import proxyAgent from 'proxy-agent'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import './logger'

export async function sendGmrMessageFromFile(relativePath) {
  globalThis.testLogger.info({
    event: '[GMR] About to send a GMR message'
  })
  await new Promise((resolve) => setTimeout(resolve, 200))
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const filePath = path.resolve(__dirname, relativePath)
  const fileContent = await readFile(filePath, 'utf-8')
  const json = JSON.parse(fileContent)
  return await sendGmrMessage(json)
}

export async function sendGmrMessage(json) {
  globalThis.proxy = process.env.CDP_HTTPS_PROXY
  if (globalThis.proxy) {
    globalThis.testLogger.info({
      event: '[GMR] Global Proxy value is',
      proxy: globalThis.proxy
    })
  }

  const connectionString = process.env.ServiceBus__Gmrs__ConnectionString

  globalThis.testLogger.info({
    event: '[GMR] Using the following Connection String',
    connectionString
  })

  if (!connectionString) {
    globalThis.testLogger.info({
      event: '[GMR] Connection String is empty'
    })
    throw new Error('Request failed: Connection string is EMPTY')
  }

  const queueOrTopicName = connectionString.match(/EntityPath=([^;]+)/)[1]
  globalThis.testLogger.info({
    event: '[GMR] Queue or Topic Name is',
    queueOrTopicName
  })

  const body = typeof json === 'object' ? JSON.stringify(json) : json
  globalThis.testLogger.info({
    event: '[GMR] Prepared Message Body is',
    body
  })

  let sbClient
  if (globalThis.proxy) {
    globalThis.testLogger.info({
      event: '[GMR] About to set-up agent using proxy'
    })
    const agent = proxyAgent(globalThis.proxy)

    sbClient = new ServiceBusClient(connectionString, {
      webSocketOptions: {
        webSocket: WebSocket,
        webSocketConstructorOptions: {
          agent
        }
      }
    })
    globalThis.testLogger.info({
      event: '[GMR] ServiceBus client has been set-up',
      sbClient
    })
  } else {
    globalThis.testLogger.info({
      event: '[GMR] Creating ServiceBus client without a proxy'
    })
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
    globalThis.testLogger.info({
      event: '[GMR] Attempting to send a message'
    })
    await sender.sendMessages(message)

    globalThis.testLogger.info({
      event: '[GMR] Successfully sent message to Service Bus'
    })
    return {
      requestId,
      gmrBody: body,
      success: true,
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    globalThis.testLogger.info({
      event: '[GMR] Unable to send the message'
    })
    throw new Error(`Request failed: ${err.message || err}`)
  } finally {
    try {
      await sender.close()
      globalThis.testLogger.info({
        event: '[GMR] Successfully closed the sender'
      })
    } catch (closeErr) {
      globalThis.testLogger.info({
        event: '[GMR] Error when trying to close the sender'
      })
    }

    try {
      await sbClient.close()
      globalThis.testLogger.info({
        event: '[GMR] Successfully closed the ServiceBus Client'
      })
    } catch (closeErr) {
      globalThis.testLogger.info({
        event: '[GMR] Error closing the ServiceBus client'
      })
    }
  }
}
