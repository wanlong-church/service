import { fetchGoogleSheetData } from '@/app/_thirdParty/googleSheet'
import SheetView from './sheet-view'

export default function FullCalendarPage() {
  const sheetDataPromise = fetchGoogleSheetData()
  return (
    <div className="p-3">
      <SheetView sheetDataPromise={sheetDataPromise} />
    </div>
  )
}
