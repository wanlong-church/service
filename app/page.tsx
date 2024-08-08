'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function Page() {
  const searchParams = useSearchParams()
  const userNameDefault = searchParams.get('user') || ''
  const [userName, setUserName] = useState<string>(userNameDefault)
  const router = useRouter()

  const handleSubmit = () => {
    router.push(`/dashboard?user=${encodeURIComponent(userName)}`)
  }

  return (
    <div className="bg-whitesmoke flex h-screen w-screen flex-col justify-center">
      <div className="mb-3">
        <div className="flex flex-col items-center">
          <div className="text-xl">歡迎來到</div>
          <div className="text-3xl">萬隆基督的教會</div>
          <div className="text-xl">服事表</div>
        </div>
      </div>
      <div>
        <div className="flex flex-col items-center space-y-3 p-3">
          <div className="flex items-center">
            <Input
              placeholder="您的名字"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <div className="flex items-center">
            <Button onClick={handleSubmit}>進入服事表</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
