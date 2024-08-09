/* server side component to fetch google data */

import { fetchGoogleSheetData } from '@/app/_thirdParty/googleSheet'
import SheetView from './sheet-view'

export default async function DashboardPage() {
  const sheetData = await fetchGoogleSheetData()
  return <SheetView sheetData={sheetData} />
}
