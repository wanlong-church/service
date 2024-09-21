import { NextResponse } from 'next/server'
import { getSheetUrl } from '../utility'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const thisYearUrl = getSheetUrl('current')
    const nextYearUrl = getSheetUrl('next')
    return NextResponse.json({ thisYearUrl, nextYearUrl })
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching sheet url' }, { status: 500 })
  }
}
