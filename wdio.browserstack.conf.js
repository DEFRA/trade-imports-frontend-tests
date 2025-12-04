import fs from 'node:fs'
import { browserStackCapabilities } from './wdio.browserstack.capabilities.js'

const debug = process.env.DEBUG
const oneHour = 60 * 60 * 1000

export const config = {
  runner: 'local',
  baseUrl: `https://btms-portal-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`,

  user: process.env.BROWSERSTACK_USER,
  key: process.env.BROWSERSTACK_KEY,

  specs: ['./test/specs/**/*.js'],
  exclude: [],
  maxInstances: 3,
  commonCapabilities: {
    'bstack:options': {
      buildName: `trade-imports-frontend-tests-${process.env.ENVIRONMENT}`
    }
  },
  capabilities: browserStackCapabilities,
  services: [
    [
      'browserstack',
      {
        testObservability: true,
        testObservabilityOptions: {
          user: process.env.BROWSERSTACK_USER,
          key: process.env.BROWSERSTACK_KEY,
          projectName: 'trade-imports-frontend-tests',
          buildName: `trade-imports-frontend-tests-${process.env.ENVIRONMENT}`
        },
        acceptInsecureCerts: true,
        forceLocal: false,
        browserstackLocal: true
      }
    ]
  ],

  execArgv: [
    '--loader',
    'esm-module-alias/loader',
    ...(debug ? ['--inspect'] : [])
  ],

  logLevel: debug ? 'debug' : 'info',

  bail: 0,
  waitforTimeout: 6000,
  waitforInterval: 300,
  connectionRetryTimeout: 60000,
  connectionRetryCount: 3,

  framework: 'mocha',

  reporters: [
    [
      'spec',
      {
        addConsoleLogs: true,
        realtimeReporting: true,
        color: false
      }
    ],
    [
      'allure',
      {
        outputDir: 'allure-results'
      }
    ]
  ],
  mochaOpts: {
    ui: 'bdd',
    timeout: debug ? oneHour : 120000
  },
  afterTest: async function (_, __, ___) {
    await browser.takeScreenshot()
  },

  onComplete: function (exitCode, config, capabilities, results) {
    // !Do Not Remove! Required for test status to show correctly in portal.
    if (results?.failed && results.failed > 0) {
      fs.writeFileSync('FAILED', JSON.stringify(results))
    }
  }
}
