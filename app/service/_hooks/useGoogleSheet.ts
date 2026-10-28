import { useQuery, useQueryClient } from '@tanstack/react-query'
import { fetchGoogleSheetData } from '@/app/api/client'
import { QUERY_KEY } from '@/app/const'
import { toast } from '@/hooks/use-toast'
import { captureMessage } from '@sentry/nextjs'

/** 取得服事表資料；部分服事表無法讀取時，以 toast 提示原因 */
async function fetchGoogleSheetDataWithWarnings() {
  const data = await fetchGoogleSheetData()
  data.warnings?.forEach((warning) => toast({ variant: 'error', description: warning.message }))
  return data
}

export default function useGoogleSheet() {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: [QUERY_KEY.GOOGLE_SHEET],
    queryFn: fetchGoogleSheetDataWithWarnings,
    // 沒有快取資料時才顯示錯誤頁面；已有資料時保留畫面，錯誤由 toast 提示
    throwOnError: (_error, sheetQuery) => sheetQuery.state.data === undefined,
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
