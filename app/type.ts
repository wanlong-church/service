import { SERVICE_TYPES, SHEET_FIELDS } from './const'

/**
 * The row of data from the Google Sheet.
 * Each key is a SheetField, and the corresponding value is a string.
 */
export type Row = Record<SheetField, string>

/**
 * The structure of the response from fetching Google Sheet data.
 */
export type GoogleSheetResponse = {
  /** An array of Row objects containing the sheet data. */
  data: Row[]
  /** Optional error message if the fetch operation fails. */
  error?: string
}

/**
 * The structure of the response from fetching Google Sheet Url.
 */
export type GoogleSheetUrlResponse = {
  url: string
  error?: string
}

/**
 * The current status of the Google Sheet data.
 */
export type SheetStatus = {
  /** The URL of the Google Sheet. */
  url: string
  /** The last update time of the sheet data. */
  updated?: string
  /** An array of Row objects containing the sheet data. */
  data: Row[]
  /** Optional error message if there's an issue with the sheet. */
  error?: string
}

/**
 * The mode of the dashboard view.
 */
export type DashboardMode = 'all' | 'personal'

/**
 * The type of our dashboard global state.
 */
export type DashboardState = {
  /** The current mode of the dashboard. */
  mode: DashboardMode
  /** The current user's identifier. */
  user: string
  /** The current status of the Google Sheet. */
  sheetStatus: SheetStatus
  /** Indicates whether the state has been hydrated from storage. */
  _hasHydrated: boolean
  /** Function to set the dashboard mode. */
  setMode: (mode: DashboardMode) => void
  /** Function to set the current user. */
  setUser: (user: string) => void
  /** Function to update the sheet status. */
  setSheetStatus: (sheetStatus: Partial<SheetStatus>) => void
  /** Function to set the hydration status. */
  setHasHydrated: (hasHydrated: boolean) => void
}

/**
 * A type of service, defined in SERVICE_TYPES constant.
 */
export type ServiceType = (typeof SERVICE_TYPES)[number]

/**
 * A field in the Google Sheet, defined in SHEET_FIELDS constant.
 */
export type SheetField = (typeof SHEET_FIELDS)[number]

/**
 * A time string in 24-hour format (HH:MM).
 */
export type TimeString =
  | `${'0' | '1'}${'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'}:${'0' | '1' | '2' | '3' | '4' | '5'}${'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'}`
  | `2${'0' | '1' | '2' | '3'}:${'0' | '1' | '2' | '3' | '4' | '5'}${'0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9'}`

/**
 * A service time with start and end times.
 */
export type ServiceTime = {
  start: TimeString
  end: TimeString
}

/**
 * A service record with date, type, and user.
 */
export type ServiceRecord = {
  date: Date
  type: ServiceType
  user: string
}
