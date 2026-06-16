'use client'

import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'

const DISMISS_KEY = 'pwa-install-dismissed'

/** The `beforeinstallprompt` event isn't in the standard lib DOM types yet. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandalone() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari exposes standalone via a non-standard navigator flag
    (window.navigator as Navigator & { standalone?: boolean }).standalone === true
  )
}

function isIOS() {
  if (typeof window === 'undefined') return false
  const ua = window.navigator.userAgent
  return (
    /iphone|ipad|ipod/i.test(ua) ||
    // iPadOS 13+ reports as MacIntel but has touch points
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showIOSHint, setShowIOSHint] = useState(false)

  useEffect(() => {
    if (isStandalone() || localStorage.getItem(DISMISS_KEY) === '1') return

    const onBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)

    // iOS has no beforeinstallprompt — show manual instructions instead.
    if (isIOS()) setShowIOSHint(true)

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
  }, [])

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1')
    setDeferredPrompt(null)
    setShowIOSHint(false)
  }

  const install = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    await deferredPrompt.userChoice
    setDeferredPrompt(null)
  }

  if (!deferredPrompt && !showIOSHint) return null

  return (
    <div className="fixed inset-x-2 top-2 z-50 mx-auto max-w-md rounded-lg border bg-white p-4 shadow-lg dark:bg-gray-800">
      <div className="flex items-start gap-3">
        <div className="flex-1 text-sm text-gray-700 dark:text-gray-200">
          {deferredPrompt ? (
            <p className="font-medium">將「萬隆服事表」加入主畫面，使用更方便！</p>
          ) : (
            <p>
              <span className="font-medium">加入主畫面：</span>
              點擊瀏覽器的「分享」
              <span aria-hidden> ⬆️ </span>
              按鈕，再選擇「加入主畫面」。
            </p>
          )}
        </div>
        <button
          onClick={dismiss}
          aria-label="關閉"
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      {deferredPrompt && (
        <div className="mt-3 flex justify-end gap-2">
          <Button variant="outline" size="sm" onClick={dismiss}>
            稍後
          </Button>
          <Button size="sm" onClick={install}>
            加入主畫面
          </Button>
        </div>
      )}
    </div>
  )
}
