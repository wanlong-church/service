'use client'

import { GoogleSheetResponse, GoogleSheetUrlResponse } from '@/app/type'

/**
 * Calls one of our API routes. Every failure becomes an Error whose message can be shown to
 * users as is.
 */
async function fetchJson<T extends { error?: string }>(url: string): Promise<T> {
  let response: Response
  try {
    response = await fetch(url)
  } catch (error) {
    throw new Error('無法連線到伺服器，請確認網路連線後再試', { cause: error })
  }
  // A non-JSON body, such as an App Engine error page, becomes undefined instead of a SyntaxError
  const body: T | undefined = await response.json().catch(() => undefined)
  if (body?.error) {
    throw new Error(body.error)
  }
  if (!response.ok || !body) {
    throw new Error(`伺服器暫時無法回應（HTTP ${response.status}），請稍後再試`)
  }
  return body
}

export async function fetchGoogleSheetData(): Promise<GoogleSheetResponse> {
  return fetchJson<GoogleSheetResponse>('/api/google-sheet')
}

export async function fetchGoogleSheetUrl(): Promise<GoogleSheetUrlResponse> {
  return fetchJson<GoogleSheetUrlResponse>('/api/google-sheet/url')
}
