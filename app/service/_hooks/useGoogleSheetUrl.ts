import { useQuery } from '@tanstack/react-query'
import { fetchGoogleSheetUrl } from '@/app/api/client'
import { QUERY_KEY } from '@/app/const'

export default function useGoogleSheetUrl() {
  const query = useQuery({
    queryKey: [QUERY_KEY.GOOGLE_SHEET_URL],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: fetchGoogleSheetUrl,
    select: (data) => data?.url,
    retry: 3,
    retryDelay: 1000,
  })

  return query
}
