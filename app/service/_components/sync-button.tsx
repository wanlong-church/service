'use client'

import { format } from 'date-fns'
import { zhTW } from 'date-fns/locale'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FaSyncAlt } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import useGoogleSheet from '../_hooks/useGoogleSheet'
import useGoogleSheetUrl from '../_hooks/useGoogleSheetUrl'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEY } from '@/app/const'
import { GoogleSheetResponse } from '@/app/type'

export default function SyncButton() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { dataUpdatedAt, isFetching, isRefetching, refetch: refetchSheet } = useGoogleSheet()
  const { refetch: refetchSheetUrl } = useGoogleSheetUrl()
  const refetch = async () => {
    const sheetResult = await refetchSheet()
    const sheetUrlResult = await refetchSheetUrl()
    const warnings =
      queryClient.getQueryData<GoogleSheetResponse>([QUERY_KEY.GOOGLE_SHEET])?.warnings ?? []
    // 同一時間只會顯示一個 toast，同步失敗或有警告時保留原本的錯誤提示，不以成功訊息覆蓋
    if (!sheetResult.isSuccess || !sheetUrlResult.isSuccess || warnings.length > 0) return
    toast({
      description: '表單資料已成功同步',
      variant: 'notice',
      duration: 3000,
    })
  }
  const formattedDate = format(new Date(dataUpdatedAt), 'yyyy年MM月dd日 HH:mm:ss', { locale: zhTW })
  const isSyncing = isFetching || isRefetching
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button disabled={isSyncing}>
          <FaSyncAlt className={cn(isSyncing && 'mr-2 animate-spin')} />
          {isSyncing && '同步中'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> 上次同步時間： {formattedDate} </DialogTitle>
          <DialogDescription> 按下按鈕會從 Google Sheet 取得最新的表單資料。 </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={() => refetch()}>
              同步表單資料
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
