import { browser } from '@wdio/globals'

let baseline = 0

const readLogs = async () => {
  try {
    return await browser.getLogs('browser')
  } catch {
    return []
  }
}

const isWave = (log) =>
  log.source === 'network' &&
  log.message.includes('/img/icons/') &&
  log.message.includes('Failed to load resource')

const isEnvironmentNotice = (log) =>
  log.message.includes('origin-keyed agent cluster') ||
  log.message.includes('Cross-Origin-Opener-Policy header has been ignored')

export const mochaHooks = {
  async beforeEach() {
    baseline = (await readLogs()).length
  },
  async afterEach() {
    const logs = (await readLogs())
      .slice(baseline)
      .filter((log) => !isWave(log) && !isEnvironmentNotice(log))
    if (!logs.length) return

    throw new Error(
      `Console output during "${this.currentTest?.fullTitle()}":\n` +
        logs.map((log) => `  [${log.level}] ${log.message}`).join('\n')
    )
  }
}
