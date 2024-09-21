import { useQuery } from '@tanstack/react-query'
import { fetchGoogleSheetUrl } from '@/app/api/client'
import { QUERY_KEY } from '@/app/const'
import { GoogleSheetUrlResponse } from '@/app/type'

export default function useGoogleSheetUrl() {
  const query = useQuery<GoogleSheetUrlResponse, Error>({
    queryKey: [QUERY_KEY.GOOGLE_SHEET_URL],
    staleTime: Infinity,
    gcTime: Infinity,
    queryFn: fetchGoogleSheetUrl,
    select: (data) => ({ thisYearUrl: data.thisYearUrl, nextYearUrl: data.nextYearUrl }),
    retry: 3,
    retryDelay: 1000,
  })

  return query
}
