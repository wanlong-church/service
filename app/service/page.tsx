'use client'

import Loading from '../loading'
import PersonalView from './_components/personal-view'
import AllServiceView from './_components/all-service-view'
import useGoogleSheet from './_hooks/useGoogleSheet'
import { useIsClient } from './_hooks/useIsClient'
import { useUserStore } from '@/stores/useUserStore'
import { useShallow } from 'zustand/shallow'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function ServicesPage() {
  // 數據和客戶端狀態
  const { data: sheetData = [], isLoading, isSuccess } = useGoogleSheet()
  const isClient = useIsClient()
  const { queryUser } = useSyncUserWithQuery(isClient)
  if (!isClient || isLoading) return <Loading />
  if (isSuccess)
    return queryUser ? (
      <PersonalView data={sheetData} user={queryUser} />
    ) : (
      <AllServiceView serviceData={sheetData} className="grow pb-16" />
    )

  return <Loading />
}

/**
 * 用於同步URL查詢參數和用戶名稱的狀態
 * @param isClient 是否在客戶端渲染
 */
function useSyncUserWithQuery(isClient: boolean): {
  /** 查詢參數中的用戶名稱  */
  queryUser: string | null
} {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryUser = searchParams.get('user')

  const userStore = useUserStore(
    useShallow((state) => ({
      user: state.user,
      setUser: state.setUser,
    }))
  )

  useEffect(() => {
    if (!isClient) return

    if (queryUser && queryUser !== userStore.user) {
      userStore.setUser(queryUser)
    } else if (queryUser === '' && userStore.user) {
      router.replace(`${pathname}?user=${userStore.user}`)
    }
  }, [isClient, userStore, queryUser, router, pathname, searchParams])

  return { queryUser }
}
