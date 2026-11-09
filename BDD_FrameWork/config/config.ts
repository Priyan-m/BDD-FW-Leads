import dotenv from 'dotenv';
import { LaunchOptions } from '@playwright/test';

dotenv.config();

const BASE_URL = process.env.BASE_URL;

const getBooleanEnv = (name: string, defaultValue: boolean): boolean => {
  const value = process.env[name];
  if (value === undefined) {
    return defaultValue;
  }

  switch (value.trim().toLowerCase()) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      throw new Error(`Invalid boolean value for ${name}: "${value}". Use "true" or "false".`);
  }
};

// Timeout values
const DEFAULT_TIMEOUT = 30000;
const STEP_TIMEOUT = 60000;

// use chromium | chrome | msedge | firefox | webkit
const SET_BROWSER = process.env.BROWSER as string ; // Default to chrome if not specified

// Browser configuration
const browserOptions: Record<string, LaunchOptions> = {
  chrome: {
    channel: 'chrome',
    headless: getBooleanEnv('HEADLESS', false),
    args: [
      '--start-maximized',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-proxy-server'
    ],
    slowMo: 20
  },
  msedge: {
    channel: 'msedge',
    headless: getBooleanEnv('HEADLESS', false),
    args: [
      '--start-maximized',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--no-proxy-server'
    ],
    slowMo: 20
  },
  firefox: {
    headless: getBooleanEnv('HEADLESS', false),
    slowMo: 20,
    args: ['--kiosk'],
  },
  webkit: {
    headless: getBooleanEnv('HEADLESS', false),
    slowMo: 20,
    args: ['--start-maximized'],
  },
};

// Screenshot, video, and trace options
const screenshotOptions = {
  takeOnFailure: true,
  takeOnSuccess: true,
  path: './reports/screenshots/'
};

const videoOptions = {
  enabled: getBooleanEnv('VIDEO_ENABLED', true),
  path: './reports/videos/'
};

const traceOptions = {
  enabled: getBooleanEnv('TRACE_ENABLED', true),
  path: './reports/traces/'
};

// Data storage paths
const dataPaths = {
  csv: './test-data/',
  json: './test-data/',
  excel: './test-data/'
};

export {
  BASE_URL,
  SET_BROWSER,
  DEFAULT_TIMEOUT,
  STEP_TIMEOUT,
  browserOptions,
  screenshotOptions,
  videoOptions,
  traceOptions,
  dataPaths
};