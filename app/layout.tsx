import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import { GoogleAnalytics } from '@next/third-parties/google'
import { cn } from '@/lib/utils'
import { Providers } from '@/providers'
import { Toaster } from '@/components/ui/toaster'
import InstallPrompt from '@/components/pwa/install-prompt'
import AppleSplashScreens from '@/components/pwa/apple-splash-screens'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '萬隆服事表',
  description: '萬隆服事表',
  applicationName: '萬隆服事表',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: '萬隆服事表',
  },
  // Next emits the modern `mobile-web-app-capable`; older iOS still needs the
  // legacy apple-prefixed tag to launch standalone (and show splash screens).
  other: {
    'apple-mobile-web-app-capable': 'yes',
  },
  icons: {
    icon: '/android/android-launchericon-192-192.png',
    apple: [{ url: '/ios/180.png', sizes: '180x180', type: 'image/png' }],
  },
}

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-TW">
      <head>
        <AppleSplashScreens />
      </head>
      <body className={cn('bg-background font-sans antialiased', inter.variable)}>
        <Providers>{children}</Providers>
        <InstallPrompt />
        <Toaster />
      </body>
      <GoogleAnalytics gaId="G-NNCSCYXNM9" />
    </html>
  )
}
