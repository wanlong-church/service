import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * 處理 Tailwind CSS 可選狀態以及合併類別名稱
 * @description - 依照狀態使用或不使用 class: cn('base-class', true && 'optional-class-1', false && 'optional-class-2')
 * @description - 使用相同系列的 className 時，使用較後面的 className: cn('text-white', 'text-green')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
