'use client'

import Link from 'next/link'
import { useShallow } from 'zustand/shallow'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useUserStore } from '@/stores/useUserStore'
import PersonalSearchBar from './personal-search-bar'
import SyncButton from './sync-button'
import { generateQueryString } from '@/lib/utils'

export default function Navigator() {
  const user = useUserStore(useShallow((state) => state.user))
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const onPersonalPage = pathname === '/service' && !!searchParams.get('user')
  return (
    <div className="flex min-h-16 items-center justify-center space-x-5 border-b bg-gray-200 px-3 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
      <SyncButton />
      {user && !onPersonalPage ? (
        <Button asChild>
          <Link href={`/service?${generateQueryString('user', user)}`}> 我的服事表 </Link>
        </Button>
      ) : (
        <PersonalSearchBar />
      )}
      <Button asChild>
        <Link href="/service"> 看總表 </Link>
      </Button>
    </div>
  )
}
