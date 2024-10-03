import { type ClassValue, clsx } from 'clsx'
import { format, isValid } from 'date-fns'
import { twMerge } from 'tailwind-merge'

/**
 * 處理 Tailwind CSS 可選狀態以及合併類別名稱
 * @description - 依照狀態使用或不使用 class: cn('base-class', true && 'optional-class-1', false && 'optional-class-2')
 * @description - 使用相同系列的 className 時，使用較後面的 className: cn('text-white', 'text-green')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 建立查詢字串
 * @param name 查詢名稱
 * @param value 查詢值
 * @returns 查詢字串
 */
export function generateQueryString(name: string, value: string) {
  const params = new URLSearchParams()
  params.set(name, value)
  return params.toString()
}

/**
 * 安全地格式化日期
 * @description 如果輸入是有效日期，則使用 date-fns 的 format 函數進行格式化；否則返回原始輸入[並轉成字串]
 * @param params format 函數的參數
 * @returns 格式化後的日期字符串或原始輸入
 */
export function safeFormatDate(...params: Parameters<typeof format>): ReturnType<typeof format> {
  const [originalDate] = params
  const date = originalDate instanceof Date ? originalDate : new Date(originalDate)

  return isValid(date) ? format(...params) : `${originalDate}`
}
