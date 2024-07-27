import { fetchGoogleSheetData } from '@/app/_thirdParty/googleSheet'
import SheetView from './sheet-view'

export default function DashboardPage() {
  const sheetDataPromise = fetchGoogleSheetData()
  return (
    <div className="h-full p-3">
      <SheetView sheetDataPromise={sheetDataPromise} />
    </div>
  )
}
