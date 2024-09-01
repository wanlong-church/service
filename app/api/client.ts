'use client'

import { GoogleSheetResponse, GoogleSheetUrlResponse } from '@/app/type'

export async function fetchGoogleSheetData(): Promise<GoogleSheetResponse> {
  const response = await fetch('/api/google-sheet')
  const data: GoogleSheetResponse = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return data
}

export async function fetchGoogleSheetUrl(): Promise<GoogleSheetUrlResponse> {
  const response = await fetch('/api/google-sheet/url')
  const data: { url: string; error?: string } = await response.json()
  if (data.error) {
    throw new Error(data.error)
  }
  return data
}
