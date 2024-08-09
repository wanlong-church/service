import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function SearchBox({
  userName,
  setUserName,
  setMode,
}: {
  userName: string
  setUserName: (userName: string) => void
  setMode: (mode: string) => void
}) {
  const [localUserName, setLocalUserName] = useState(userName)

  const router = useRouter()
  useEffect(() => {
    const query = `user=${encodeURIComponent(userName)}&mode=personal`
    router.replace(`/dashboard?${query}`)
  }, [userName, router])

  const handleSubmit = () => {
    setMode('personal')
    setUserName(localUserName)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button> 搜尋 </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle> 搜尋條件 </DialogTitle>
          <DialogDescription>輸入您的搜尋條件，然後按下「搜尋」。</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              你的名子
            </Label>
            <Input
              id="name"
              placeholder="請輸入名子"
              defaultValue={localUserName}
              onChange={(e) => setLocalUserName(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" onClick={handleSubmit}>
              搜尋
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
