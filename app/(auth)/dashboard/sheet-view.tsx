'use client'

import { useState } from 'react'
import { GoogleSheetResponse, Row } from '../../_thirdParty/googleSheet'
import { useSearchParams } from 'next/navigation'
import SearchHeader from './search-header'
import FullView from './full-view'
import CustomView from './custom-view'

const SheetView = ({ sheetData }: { sheetData: GoogleSheetResponse }) => {
  /** initialize search parameters from URL */
  const searchParams = useSearchParams()
  const userNameDefault = searchParams.get('user') || ''
  const modeDefault = searchParams.get('mode') || 'all'
  const [userName, setUserName] = useState<string>(userNameDefault)
  const [mode, setMode] = useState<string>(modeDefault)

  return (
    <div>
      <div className="fixed left-0 top-0 z-10 h-16 w-full bg-gray-200">
        <SearchHeader userName={userName} setUserName={setUserName} setMode={setMode} />
      </div>
      <div className="mt-16 flex-grow">
        {mode === 'personal' ? (
          <CustomView sheetData={sheetData} userName={userName} />
        ) : (
          <FullView sheetData={sheetData} />
        )}
      </div>
    </div>
  )
}

export default SheetView
