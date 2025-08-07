import { ServiceBusClient } from '@azure/service-bus'
import { setLogLevel, AzureLogger } from '@azure/logger'
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
  AzureLogger.log = (...args) => {
    console.log('[AZURE]', ...args)
  }
  setLogLevel('verbose')

  const connectionString =
    process.env.ServiceBus__Notifications__ConnectionString

  console.log('[IPAFFS] is there a connection string: ', !!connectionString)
  console.log('[IPAFFS] Connection String: ', connectionString)
  /* globalThis.testLogger.info({
    message: 'Connection string check',
    hasConnectionString: !!connectionString,
    connectionStringLength: connectionString ? connectionString.length : 0
  }) */

  if (!connectionString) {
    console.log('[IPAFFS] Connection string is empty or undefined')
    throw new Error('Request failed: Connection string is EMPTY')
  }

  const queueOrTopicName = connectionString.match(/EntityPath=([^;]+)/)[1]
  console.log('[IPAFFS] queue or topic name is: ', queueOrTopicName)
  /* globalThis.testLogger.info({
    message: 'Extracted queue/topic name',
    queueOrTopicName,
    connectionString: connectionString.substring(0, 50) + '...' // Log first 50 chars for debugging
  }) */

  const body = typeof json === 'object' ? JSON.stringify(json) : json
  console.log('[IPAFFS] Message body is: ', body)
  /* globalThis.testLogger.info({
    message: 'Prepared message body',
    bodyType: typeof json,
    bodyLength: body.length,
    bodyPreview: body
  }) */

  let sbClient
  if (globalThis.proxy) {
    console.log('[IPAFFS] About to use the proxy')
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
    console.log('[IPAFFS] Creating service bus without the proxy')
    /* globalThis.testLogger.info({
      message: 'Creating ServiceBus client without proxy'
    }) */
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
    console.log('[IPAFFS] About to send a message')
    /* globalThis.testLogger.info({
      message: 'Attempting to send message to ServiceBus',
      requestId
    }) */
    await sender.sendMessages(message)

    console.log('[IPAFFS] Successfully sent the message')
    /* globalThis.testLogger.info({
      message: 'Successfully sent message to ServiceBus',
      requestId,
      success: true,
      timestamp: new Date().toISOString()
    }) */

    return {
      requestId,
      ipaffsBody: body,
      success: true,
      timestamp: new Date().toISOString()
    }
  } catch (err) {
    console.log('[IPAFFS] Failed to send the messsage to Service Bus')
    /* globalThis.testLogger.error({
      message: 'Failed to send message to ServiceBus',
      requestId,
      requestBody: body,
      err: err.message || err,
      success: false,
      errorType: err.constructor.name,
      errorStack: err.stack
    }) */
    throw new Error(`Request failed: ${err.message || err}`)
  } finally {
    console.log('[IPAFFS] Cleaning up ServiceBus resources')
    /* globalThis.testLogger.info({
      message: 'Cleaning up ServiceBus resources',
      requestId
    }) */
    try {
      await sender.close()
      console.log('[IPAFFS] Successfully closed the sender')
      /* globalThis.testLogger.info({
        message: 'Successfully closed sender',
        requestId
      }) */
    } catch (closeErr) {
      console.log('[IPAFFS] Error when trying to close the sender')
      /* globalThis.testLogger.error({
        message: 'Error closing sender',
        requestId,
        error: closeErr.message
      }) */
    }

    try {
      await sbClient.close()
      console.log('[IPAFFS] Successfully closed the ServiceBus client')
      /* globalThis.testLogger.info({
        message: 'Successfully closed ServiceBus client',
        requestId
      }) */
    } catch (closeErr) {
      console.log('[IPAFFS] Error when trying to close the Service Bus client')
      /* globalThis.testLogger.error({
        message: 'Error closing ServiceBus client',
        requestId,
        error: closeErr.message
      }) */
    }
  }
}
