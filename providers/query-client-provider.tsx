'use client'

import type * as React from 'react'
import { QueryClient, defaultShouldDehydrateQuery, QueryCache } from '@tanstack/react-query'
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useToast } from '@/hooks/use-toast'
import { useMemo } from 'react'

export default function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast()
  const { queryClient, persister } = useMemo(() => {
    const qc = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 7 * 24 * 60 * 60 * 1000, // 7 days
          gcTime: Infinity,
        },
        dehydrate: {
          // Persist queries that hold data: successful ones, and ones whose latest
          // refetch failed, so a failed sync keeps the last good roster in localStorage.
          // Never persist a pending query. It carries a Promise, which JSON.stringify
          // turns into `{}`; persist-client's hydrate() then calls `.then()` on it,
          // throws, and wipes the whole persisted cache. A pending query has no data,
          // so the data check below already excludes it.
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) || query.state.data !== undefined,
        },
      },
      queryCache: new QueryCache({
        onError: (error, query) => {
          toast({
            variant: 'error',
            description: `${error.message}`,
          })
        },
      }),
    })

    const qcp = createSyncStoragePersister({
      storage: typeof window === 'undefined' ? undefined : window.localStorage,
    })

    return { queryClient: qc, persister: qcp }
  }, [toast])

  return (
    <PersistQueryClientProvider
      client={queryClient}
      // A new app version invalidates the persisted cache, so a deploy never
      // hydrates a payload stored by an older build
      persistOptions={{ persister: persister, buster: process.env.NEXT_PUBLIC_APP_VERSION }}
    >
      {children}
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  )
}
