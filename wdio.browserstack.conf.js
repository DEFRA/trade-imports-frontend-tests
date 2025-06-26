import fs from 'node:fs'
import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'

const debug = process.env.DEBUG
const oneHour = 60 * 60 * 1000

const dispatcher = new ProxyAgent({
  uri: 'http://localhost:3128'
})
setGlobalDispatcher(dispatcher)
bootstrap()
global.GLOBAL_AGENT.HTTP_PROXY = 'http://localhost:3128'

export const config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  // WebdriverIO supports running e2e tests as well as unit and component tests.
  runner: 'local', //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: `https://btms-portal-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`,

  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_KEY,

  // Tests to run
  specs: ['./test/specs/**/*.js'], // Tests to exclude
  exclude: [],
  maxInstances: 1,

  // Presently calls outside of the cdp environment will be dropped.
  // In chrome this can result in pages never finishing loading and the test step timing out.
  // Going forward we will be making the outbound proxy available to test suite, but until that happens
  // the work-around here is to add the external host names to the --host-resolver-rule below.
  // This causes the calls to fail instantly rather than timeout.

  commonCapabilities: {
    'bstack:options': {
      buildName: `trade-imports-frontend-tests-${process.env.ENVIRONMENT}` // configure as required
    }
  },
  capabilities: [
    {
      browserName: 'Chrome', // Set as required
      'bstack:options': {
        browserVersion: 'latest',
        os: 'Windows',
        osVersion: '11'
      }
    },
    {
      browserName: 'Firefox',
      'bstack:options': {
        browserVersion: 'latest',
        os: 'Windows',
        osVersion: '11'
      }
    },
    {
      browserName: 'Edge',
      'bstack:options': {
        browserVersion: 'latest',
        os: 'Windows',
        osVersion: '11'
      }
    },
    {
      browserName: 'Safari',
      'bstack:options': {
        browserVersion: 'latest',
        os: 'OS X',
        osVersion: 'Sequoia'
      }
    }
  ],

  services: [
    [
      'browserstack',
      {
        testObservability: true, // Disable if you do not want to use the browserstack test observer functionality
        testObservabilityOptions: {
          user: process.env.BROWSERSTACK_USER,
          key: process.env.BROWSERSTACK_KEY,
          projectName: 'trade-imports-frontend-tests',
          buildName: `trade-imports-frontend-tests-${process.env.ENVIRONMENT}`
        },
        acceptInsecureCerts: true,
        forceLocal: false,
        browserstackLocal: true,
        opts: {
          proxyHost: 'localhost',
          proxyPort: 3128
        }
      }
    ]
  ],

  execArgv: debug ? ['--inspect'] : [],

  logLevel: debug ? 'debug' : 'info',

  // Number of failures before the test suite bails.
  bail: 0,
  waitforTimeout: 1000,
  waitforInterval: 300,
  connectionRetryTimeout: 12000,
  connectionRetryCount: 1,

  framework: 'mocha',

  reporters: [
    [
      // Spec reporter provides rolling output to the logger so you can see it in-progress
      'spec',
      {
        addConsoleLogs: true,
        realtimeReporting: true,
        color: false
      }
    ],
    [
      // Allure is used to generate the final HTML report
      'allure',
      {
        outputDir: 'allure-results'
      }
    ]
  ],

  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  mochaOpts: {
    ui: 'bdd',
    timeout: debug ? oneHour : 60000
  }, //
  // =====
  // Hooks
  afterTest: async function (
    test,
    context,
    { error, result, duration, passed, retries }
  ) {
    await browser.takeScreenshot()
  },

  onComplete: function (exitCode, config, capabilities, results) {
    // !Do Not Remove! Required for test status to show correctly in portal.
    if (results?.failed && results.failed > 0) {
      fs.writeFileSync('FAILED', JSON.stringify(results))
    }
  }
}
