
require('dotenv').config();

const browserName = process.env.BROWSER;

const common = {
  requireModule: ['ts-node/register'],
  require: [
    'step_definitions/**/*.ts',
    'hooks/**/*.ts'
  ],
  format: [
    'progress',
    'json:reports/cucumber-report.json',
    'html:reports/cucumber-report.html',
    './utils/allure-reporter.js',
  ],
  formatOptions: {
    snippetInterface: 'async-await'
  }
  
};

module.exports = {
  chrome: {
    ...common,
    worldParameters: {
      browser: browserName || 'chrome'
    }
  },
  msedge: {
    ...common,
    worldParameters: {
      browser: browserName || 'msedge'
    }
  },
  firefox: {
    ...common,
    worldParameters: {
      browser: browserName || 'firefox'
    }
  },
  webkit: {
    ...common,
    worldParameters: {
      browser: browserName || 'webkit'
    }
  },
  default: {
    ...common,
    worldParameters: {
      browser: browserName
    }
  }
};
