import { useState, useEffect } from 'react'

/**
 * 自定義hook，用於檢測代碼是否在客戶端執行
 * 解決Next.js中的hydration不匹配問題
 */
export function useIsClient(): boolean {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  return isClient
}
