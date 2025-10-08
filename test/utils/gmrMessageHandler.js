import { ServiceBusClient } from '@azure/service-bus'
import { v4 as uuidv4 } from 'uuid'
import { readFile } from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

export async function sendGmrMessageFromFile(relativePath) {
  const __filename = fileURLToPath(import.meta.url)
  const __dirname = path.dirname(__filename)
  const filePath = path.resolve(__dirname, relativePath)
  const fileContent = await readFile(filePath, 'utf-8')
  const json = JSON.parse(fileContent)
  return await sendGmrMessage(json)
}

export async function sendGmrMessage(json) {
  const connectionString = process.env.Gmr__Notifications__ConnectionString
  const topicName = connectionString.split('EntityPath=')[1]
  if (!connectionString || !topicName) {
    throw new Error('GMR connection string or topic name is missing')
  }
  const sbClient = new ServiceBusClient(connectionString)
  const sender = sbClient.createSender(topicName)
  const requestId = uuidv4().replace(/-/g, '')
  const message = {
    body: json,
    applicationProperties: {
      'x-cdp-request-id': requestId
    }
  }
  try {
    await sender.sendMessages(message)
  } finally {
    await sender.close()
    await sbClient.close()
  }
  return requestId
}
