import { NextResponse } from 'next/server'
import { GoogleSheetResponse } from '@/app/type'
import { fetchGoogleSheetData } from './utility'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const sheetData: GoogleSheetResponse = await fetchGoogleSheetData()
    return NextResponse.json(sheetData)
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error)
    return NextResponse.json({ error: 'Failed to fetch Google Sheet data' }, { status: 500 })
  }
}
