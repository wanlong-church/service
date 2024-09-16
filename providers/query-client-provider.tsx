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
          // include pending queries in dehydration
          shouldDehydrateQuery: (query) =>
            defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
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
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister: persister }}>
      {children}
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  )
}
