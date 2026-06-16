import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '目前離線 | 萬隆服事表',
}

export default function OfflinePage() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-gray-100 p-3">
      <div className="w-full max-w-md rounded-lg bg-white p-8 text-center shadow-md">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">目前無法連線</h2>
        <p className="mb-2 text-gray-700">
          您目前處於離線狀態，無法載入這個頁面。請確認網路連線後再試一次。
        </p>
        <p className="text-sm text-gray-500">已造訪過的頁面在離線時仍可瀏覽。</p>
      </div>
    </div>
  )
}
