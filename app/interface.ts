import { SERVICE_TYPES, SHEET_FIELDS } from './const'

export type DashboardMode = 'all' | 'personal'

export type DashboardState = {
  mode: DashboardMode
  user: string
  setMode: (mode: DashboardMode) => void
  setUser: (user: string) => void
}

export type ServiceType = (typeof SERVICE_TYPES)[number]

export type SheetField = (typeof SHEET_FIELDS)[number]

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
