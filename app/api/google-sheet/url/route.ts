import { NextResponse } from 'next/server'
import { getSheetUrl } from '../utility'

export async function GET() {
  // return the url of the google sheet
  try {
    return NextResponse.json({ url: getSheetUrl() })
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching sheet url' }, { status: 500 })
  }
}
