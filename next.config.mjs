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
  // App Engine's filesystem is read-only. Without this, Next creates
  // .next/cache/images on the first /_next/image request and the mkdir fails
  // (ENOENT on App Engine), which surfaces as an unhandled rejection in Sentry.
  images: {
    maximumDiskCacheSize: 0,
  },
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
