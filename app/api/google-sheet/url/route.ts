import { NextResponse } from 'next/server'
import { getSheetUrl } from '../utility'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function GET() {
  // return the url of the google sheet
  try {
    return NextResponse.json({ url: getSheetUrl() })
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching sheet url' }, { status: 500 })
  }
}
