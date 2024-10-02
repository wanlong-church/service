import { useQuery } from '@tanstack/react-query'
import { fetchGoogleSheetData } from '@/app/api/client'
import { QUERY_KEY } from '@/app/const'

export default function useGoogleSheet() {
  const query = useQuery({
    queryKey: [QUERY_KEY.GOOGLE_SHEET],
    queryFn: fetchGoogleSheetData,
    throwOnError: true,
    select: (data) => data.data,
    retry: 3,
    retryDelay: 1000,
  })

  return query
}
