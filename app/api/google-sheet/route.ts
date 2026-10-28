import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { GoogleSheetResponse } from '@/app/type'
import { toSheetError } from './errors'
import { fetchGoogleSheetData } from './utility'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sheetData: GoogleSheetResponse = await fetchGoogleSheetData()
    return NextResponse.json(sheetData)
  } catch (error) {
    const sheetError = toSheetError(error)
    console.error('Error fetching Google Sheet data:', error)
    Sentry.captureException(sheetError, {
      tags: { errorCode: sheetError.code, sheet: sheetError.sheet },
    })
    return NextResponse.json(
      { error: sheetError.message, errorCode: sheetError.code },
      { status: 500 }
    )
  }
}
