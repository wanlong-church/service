import { NextResponse } from 'next/server'
import { fetchGoogleSheetData } from '@/app/(auth)/api/google-sheet/utility'
import { GoogleSheetResponse } from '@/app/type'

export async function GET() {
  try {
    const sheetData: GoogleSheetResponse = await fetchGoogleSheetData()
    return NextResponse.json(sheetData)
  } catch (error) {
    console.error('Error fetching Google Sheet data:', error)
    return NextResponse.json({ error: 'Failed to fetch Google Sheet data' }, { status: 500 })
  }
}
