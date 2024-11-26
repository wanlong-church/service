'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useShallow } from 'zustand/shallow'
import Loading from '../loading'
import PersonalView from './_components/personal-view'
import AllServiceView from './_components/all-service-view'
import useGoogleSheet from './_hooks/useGoogleSheet'
import { useUserStore } from '@/stores/useUserStore'
import { useEffect } from 'react'

export default function ServicesPage() {
  const { data: sheetData, isLoading, isSuccess } = useGoogleSheet()
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
    if (queryUser && queryUser !== userStore.user) {
      userStore.setUser(queryUser)
    } else if (queryUser === '' && userStore.user) {
      router.replace(`${pathname}?user=${userStore.user}`)
    }
  }, [userStore, queryUser, router, pathname, searchParams])
  if (isLoading) return <Loading />
  if (isSuccess)
    return queryUser ? (
      <PersonalView data={sheetData} user={queryUser} />
    ) : (
      <AllServiceView serviceData={sheetData} className="flex-grow pb-16" />
    )
}
