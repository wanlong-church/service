'use client'

import { Button } from '@/components/ui/button'
import SearchBox from './search-box'
import { useStore } from '../state'
import SyncButton from './sync-button'

export default function SearchHeader() {
  const setMode = useStore((state) => state.setMode)

  return (
    <div className="flex h-16 items-center justify-center space-x-5 border-b bg-gray-200 p-3">
      <SyncButton />
      <SearchBox />
      <Button onClick={() => setMode('all')}> 看總表 </Button>
    </div>
  )
}
