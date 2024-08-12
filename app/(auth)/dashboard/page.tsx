'use client'

import { useState, useEffect } from 'react'
import { GoogleSheetResponse } from '../api/google-sheet/utility'
import { useSearchParams } from 'next/navigation'
import SearchHeader from './search-header'
import FullView from './full-view'
import CustomView from './custom-view'
import Loading from '@/app/loading'

export default function DashboardPage() {
  const [sheetData, setSheetData] = useState<GoogleSheetResponse>({ data: [] })
  const [loading, setLoading] = useState(true)

  /** initialize search parameters from URL */
  const searchParams = useSearchParams()
  const userNameDefault = searchParams.get('user') || ''
  const modeDefault = searchParams.get('mode') || 'all'
  const [userName, setUserName] = useState<string>(userNameDefault)
  const [mode, setMode] = useState<string>(modeDefault)

  useEffect(() => {
    fetch('/api/google-sheet', { next: { revalidate: 3600 } })
      .then((response) => response.json())
      .then((data) => {
        setSheetData(data)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <Loading />
  }

  if (sheetData?.error) {
    throw Error(sheetData.error)
  }

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
