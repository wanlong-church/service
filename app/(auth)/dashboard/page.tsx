'use client'

import { useState, useEffect } from 'react'
import SearchHeader from './components/search-header'
import FullView from './components/full-view'
import CustomView from './components/custom-view'
import Loading from '@/app/loading'
import { useStore } from './state'
import { fetchGoogleSheetData, fetchGoogleSheetUrl } from '../api/client'

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)

  const [mode, sheetStatus, hasHydrated, setSheetStatus] = useStore((state) => [
    state.mode,
    state.sheetStatus,
    state._hasHydrated,
    state.setSheetStatus,
  ])
  useEffect(() => {
    // don't do anything before state is restored from local storage
    if (!hasHydrated) {
      return
    }
    // fetch url if it is empty
    if (sheetStatus.url === '') {
      fetchGoogleSheetUrl()
        .then((data) => setSheetStatus({ url: data.url }))
        .catch((error) => setSheetStatus({ error: error.message }))
    }
    // fetch data if it is empty
    if (sheetStatus.data.length === 0) {
      fetchGoogleSheetData()
        .then((data) => setSheetStatus({ data: data.data, updated: new Date().toLocaleString() }))
        .catch((error) => setSheetStatus({ error: error.message }))
    }
  }, [hasHydrated, setSheetStatus, sheetStatus.data.length, sheetStatus.url])

  useEffect(() => {
    // if state is restored from local storage and data is loaded, set loading to false
    if (hasHydrated && sheetStatus.data.length > 0 && sheetStatus.url) {
      setLoading(false)
    }
  }, [hasHydrated, sheetStatus])

  if (loading) {
    return <Loading />
  }

  if (sheetStatus.data.length === 0 && sheetStatus.error) {
    throw Error(sheetStatus.error)
  }

  return (
    <div>
      <div className="flex-grow pb-16">{mode === 'personal' ? <CustomView /> : <FullView />}</div>
      <div className="fixed bottom-0 left-0 z-10 h-16 w-full bg-gray-200">
        <SearchHeader />
      </div>
    </div>
  )
}
