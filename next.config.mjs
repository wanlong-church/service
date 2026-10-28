/** @type {import('next').NextConfig} */

import { createRequire } from 'module'
import withSerwistInit from '@serwist/next'
import { withSentryConfig } from '@sentry/nextjs'

const require = createRequire(import.meta.url)
const { version } = require('./package.json')

const withSerwist = withSerwistInit({
  swSrc: 'app/sw.ts',
  swDest: 'public/sw.js',
  // Disable the service worker in development so it doesn't fight HMR.
  disable: process.env.NODE_ENV === 'development',
  additionalPrecacheEntries: [{ url: '/~offline', revision: null }],
})

let nextConfig = {
  // Inlined into the client bundle: the persisted-cache buster and the query-key sheet ID
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_MAIN_SPREAD_SHEET_ID: process.env.MAIN_SPREAD_SHEET_ID ?? '',
  },
  devIndicators: {
    autoPrerender: false,
  },
  output: 'standalone',
}

const sentryWebpackPluginOptions = {
  org: 'wlchurch',
  project: 'service',
  silent: false, // Can be used to suppress logs
}

const sentryOptions = {
  // Upload additional client files (increases upload size)
  widenClientFileUpload: true,

  // Hides source maps from generated client bundles
  hideSourceMaps: true,
}

nextConfig = withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions)

export default withSerwist(nextConfig)
