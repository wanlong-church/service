'use client'

import { Button } from '@/components/ui/button'
import SearchBox from './search-box'
import { useRouter } from 'next/navigation'

export default function SearchHeader({
  userName,
  setUserName,
  mode,
  setMode,
}: {
  userName: string
  setUserName: (userName: string) => void
  mode: string
  setMode: (mode: string) => void
}) {
  const router = useRouter()
  const handleSubmitViewAll = () => {
    setMode('all')
    router.push(`/dashboard?user=${encodeURIComponent(userName)}&mode=all`)
  }

  return (
    <div className="flex h-16 items-center justify-center space-x-5 border-b bg-gray-200 p-3">
      <SearchBox userName={userName} setUserName={setUserName} setMode={setMode} />
      <Button onClick={handleSubmitViewAll}> 看總表 </Button>
    </div>
  )
}
