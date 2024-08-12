import { NextResponse } from 'next/server'
import { getSheetUrl } from '@/app/(auth)/api/google-sheet/utility'

export async function GET() {
  // return the url of the google sheet
  return NextResponse.json({ url: getSheetUrl() })
}
