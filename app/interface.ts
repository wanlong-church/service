import { SERVICE_TYPES, SHEET_FIELDS } from './const'

/** google sheet 總表欄位 */
export type ServiceType = (typeof SERVICE_TYPES)[number]

export type SheetField = (typeof SHEET_FIELDS)[number]

// Define a type for time strings in the format HH:MM
export type TimeString =
  | `${'0' | '1'}${'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'}:${'0' | '1' | '2' | '3' | '4' | '5'}${'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'}`
  | `2${'0' | '1' | '2' | '3'}:${'0' | '1' | '2' | '3' | '4' | '5'}${'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'}`

export type ServiceTime = {
  start: TimeString
  end: TimeString
}

export type ServiceRecord = {
  date: Date
  type: ServiceType
  user: string
}
