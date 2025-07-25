// From https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices

export const browserStackCapabilities = [
  // windows
  {
    browserName: 'Chrome',
    'wdio-ics:options': {
      logName: 'win-chrome'
    },
    'bstack:options': {
      idleTimeout: 300,
      resolution: '1920x1080',
      browserVersion: 'latest',
      os: 'Windows',
      osVersion: '11'
    }
  },
  {
    browserName: 'Edge',
    'wdio-ics:options': {
      logName: 'win-edge'
    },
    'bstack:options': {
      idleTimeout: 300,
      resolution: '1920x1080',
      browserVersion: 'latest',
      os: 'Windows',
      osVersion: '11'
    }
  },
  // macOS
  {
    browserName: 'Chrome',
    'wdio-ics:options': {
      logName: 'osx-chrome'
    },
    'bstack:options': {
      idleTimeout: 300,
      resolution: '1920x1080',
      browserVersion: 'latest',
      os: 'OS X',
      osVersion: 'Sequoia'
    }
  }
]
