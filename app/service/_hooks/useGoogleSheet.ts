import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchGoogleSheetData } from '@/app/api/client'
import { QUERY_KEY } from '@/app/const'
import { captureMessage } from '@sentry/nextjs'

export default function useGoogleSheet() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: [QUERY_KEY.GOOGLE_SHEET],
    queryFn: fetchGoogleSheetData,
    throwOnError: true,
    select: (data) => {
      const sheetData = data?.data
      const isSheetDataValid = Array.isArray(sheetData)
      if (!isSheetDataValid) {
        const cachedSheetData = queryClient.getQueryData([QUERY_KEY.GOOGLE_SHEET])
        captureMessage('Google Sheet data is not an array', {
          extra: { sheetData, cachedGoogleSheetData: cachedSheetData },
          level: 'error',
        })
      }
      return isSheetDataValid ? sheetData : []
    },
    retry: 3,
    retryDelay: 1000,
  })

  return query
}
