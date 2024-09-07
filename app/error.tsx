'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'
import { Button } from '@/components/ui/button'
import useGoogleSheetUrl from './service/_hooks/useGoogleSheetUrl'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const { data: sheetUrl, isSuccess } = useGoogleSheetUrl()
  useEffect(() => {
    console.log('sending sentry error: ', error)
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-red-600">Oops! Something went wrong</h2>
        <p className="mb-4 text-gray-700">網頁遇到非預期的錯誤，請聯絡安哲執事，或者孟軒。</p>
        <p className="mb-4 text-sm text-gray-500">點擊錯誤訊息可複製</p>
        <p className="mb-4 text-gray-700">
          <button
            className="flex w-full cursor-pointer items-center rounded p-1 text-left hover:bg-gray-200"
            onClick={() => {
              navigator.clipboard.writeText(error.message)
              alert('錯誤訊息已複製到剪貼簿')
            }}
            aria-label="複製錯誤訊息"
          >
            <span className="mr-2">{error.message}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
          </button>
        </p>
        <Button
          disabled={!isSuccess}
          onClick={() => window.open(sheetUrl, '_blank')}
          className="mr-2"
        >
          前往Google Sheet表單
        </Button>
        <Button onClick={() => window.location.reload()}>重新整理</Button>
      </div>
    </div>
  )
}
