'use client'

import { useState, useEffect } from 'react'
import { GoogleSheetResponse } from '../api/google-sheet/utility'
import SearchHeader from './search-header'
import FullView from './full-view'
import CustomView from './custom-view'
import Loading from '@/app/loading'
import { useStore } from './state'

export default function DashboardPage() {
  const [sheetData, setSheetData] = useState<GoogleSheetResponse>({ data: [] })
  const [loading, setLoading] = useState(true)
  const { mode, user } = useStore()
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
        <SearchHeader />
      </div>
      <div className="mt-16 flex-grow">
        {mode === 'personal' ? (
          <CustomView sheetData={sheetData} user={user} />
        ) : (
          <FullView sheetData={sheetData} />
        )}
      </div>
    </div>
  )
}
