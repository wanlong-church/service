'use client'

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

import { useStore } from '../state'
import { FaSyncAlt } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { fetchGoogleSheetData } from '@/app/(auth)/api/client'

export default function SyncButton() {
  const [updated, setSheetStatus] = useStore((state) => [
    state.sheetStatus.updated,
    state.setSheetStatus,
  ])

  const handleSubmit = async () => {
    fetchGoogleSheetData()
      .then((data) => setSheetStatus({ data: data.data, updated: new Date().toLocaleString() }))
      .catch((error) => setSheetStatus({ error: error.message }))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <FaSyncAlt />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> 上次同步時間： {updated} </DialogTitle>
          <DialogDescription> 按下按鈕會從 Google Sheet 取得最新的表單資料。 </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={handleSubmit}>
              同步表單資料
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
