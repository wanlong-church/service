/** @type {import('next').NextConfig} */

import nextPwa from 'next-pwa'
import { withSentryConfig } from '@sentry/nextjs'

const withPWA = nextPwa({
  dest: 'public',
})

let nextConfig = {
  env: {},
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

export default process.env.NODE_ENV === 'development' ? nextConfig : withPWA(nextConfig)
