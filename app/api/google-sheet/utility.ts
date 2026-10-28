import { google } from 'googleapis'
import * as Sentry from '@sentry/nextjs'
import { COLUMN_MAPPING, SHEET_TAB } from '@/app/const'
import { GoogleSheetResponse, GoogleSheetYear, Row, SheetWarning } from '@/app/type'
import { SHEET_LABEL, SheetError, toSheetError } from './errors'
import { ParsedSheet, parseRosterSheet } from './parse'

interface GoogleSheetClientConfig {
  clientEmail?: string
  privateKey?: string
  driveEndpoint?: string
}

type GoogleSheetClient = ReturnType<typeof createGoogleSheetClient>

// Columns are mapped by header, so a wider range costs nothing and survives inserted columns
const SHEET_RANGE = `${SHEET_TAB}!A:Z`
/**
 * Fetches data from a Google Sheet and processes it into a structured format.
 * A failure to read the next year's sheet is returned as a warning instead of an error.
 * @returns {Promise<GoogleSheetResponse>} A promise that resolves to the processed sheet data.
 * @throws {SheetError} When the current year's sheet cannot be read.
 */
export async function fetchGoogleSheetData(): Promise<GoogleSheetResponse> {
  const mainSheetId = process.env.MAIN_SPREAD_SHEET_ID
  if (!mainSheetId) {
    throw new SheetError('CONFIG_MISSING', '缺少 MAIN_SPREAD_SHEET_ID 環境變數，請確認 .env 設定')
  }
  const nextYearSheetId = process.env.NEXT_YEAR_SPREAD_SHEET_ID
  const sheetClient = createGoogleSheetClient()
  const [currentYear, nextYear] = await Promise.allSettled([
    fetchSheetRows(sheetClient, 'current', mainSheetId),
    // Skip the next year's sheet if its ID is not set
    nextYearSheetId ? fetchSheetRows(sheetClient, 'next', nextYearSheetId) : [],
  ])
  // Nothing can be shown without the current year's sheet
  if (currentYear.status === 'rejected') throw currentYear.reason

  // Keep serving the current year when only the next year's sheet fails
  const warnings: SheetWarning[] = []
  if (nextYear.status === 'rejected') {
    const sheetError = toSheetError(nextYear.reason, 'next')
    console.warn('Error fetching next year Google Sheet data:', sheetError.cause ?? sheetError)
    Sentry.captureException(sheetError, {
      level: 'warning',
      tags: { errorCode: sheetError.code, sheet: 'next' },
    })
    warnings.push({
      code: sheetError.code,
      sheet: 'next',
      message: `${sheetError.message}；目前只顯示今年度的服事`,
    })
  }

  const data = [...currentYear.value, ...(nextYear.status === 'fulfilled' ? nextYear.value : [])]
    // Sort by date, with newer service dates first
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return { data, warnings }
}

/**
 * Reads one sheet's 總表 tab and parses it with that sheet's own header row.
 * Problems that do not stop parsing are reported to Sentry.
 * @throws {SheetError} When the tab cannot be read, or has no header or no valid rows.
 */
async function fetchSheetRows(
  sheetClient: GoogleSheetClient,
  sheet: GoogleSheetYear,
  spreadsheetId: string
): Promise<Row[]> {
  const parsedSheet = parseRosterSheet(
    await fetchSheetValues(sheetClient, sheet, spreadsheetId),
    sheet
  )
  reportSheetProblems(parsedSheet, sheet)
  return parsedSheet.rows
}

/**
 * Sends a Sentry warning for missing columns and for rows dropped because of their date,
 * grouped by sheet and problem.
 */
function reportSheetProblems(
  { missingFields, unmatchedHeaders, invalidDates, issues }: ParsedSheet,
  sheet: GoogleSheetYear
) {
  if (missingFields.length > 0) {
    const missingHeaders = missingFields.map((field) => COLUMN_MAPPING[field])
    console.warn(`${SHEET_TAB} header is missing fields:`, {
      sheet,
      missingHeaders,
      unmatchedHeaders,
    })
    Sentry.captureMessage(`${SHEET_TAB} header is missing fields`, {
      level: 'warning',
      tags: { sheet },
      extra: { missingFields, missingHeaders, unmatchedHeaders },
      fingerprint: ['sheet-missing-fields', sheet, ...missingFields],
    })
  }
  if (invalidDates.length > 0) {
    console.warn(`${SHEET_TAB} has rows with unparseable dates:`, { sheet, invalidDates })
    Sentry.captureMessage(`${SHEET_TAB} has rows with unparseable dates`, {
      level: 'warning',
      tags: { sheet },
      extra: { invalidDates },
      fingerprint: ['sheet-invalid-dates', sheet],
    })
  }
  if (issues.length > 0) {
    console.warn(`${SHEET_TAB} has spreadsheet error values:`, { sheet, issues })
    Sentry.captureMessage(`${SHEET_TAB} has spreadsheet error values`, {
      level: 'warning',
      tags: { sheet },
      extra: { issues },
      fingerprint: ['sheet-error-values', sheet],
    })
  }
}

/**
 * Reads the 總表 tab of one sheet.
 * @throws {SheetError} For any failure, including a tab with no data.
 */
async function fetchSheetValues(
  sheetClient: GoogleSheetClient,
  sheet: GoogleSheetYear,
  spreadsheetId: string
): Promise<string[][]> {
  try {
    const { data } = await sheetClient.spreadsheets.values.get({
      spreadsheetId,
      range: SHEET_RANGE,
    })
    const values = data.values
    if (!Array.isArray(values) || values.length === 0) {
      throw new SheetError(
        'EMPTY_SHEET',
        `${SHEET_LABEL[sheet]}的「${SHEET_TAB}」分頁沒有任何資料`,
        sheet
      )
    }
    return values as string[][]
  } catch (error) {
    throw toSheetError(error, sheet)
  }
}

function createGoogleSheetClient({
  clientEmail = process.env.GOOGLE_CLIENT_EMAIL ?? '',
  privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n') ?? '',
  driveEndpoint = process.env.GOOGLE_DRIVE_ENDPOINT ?? '',
}: GoogleSheetClientConfig = {}) {
  if (!clientEmail || !privateKey || !driveEndpoint) {
    throw new SheetError(
      'CONFIG_MISSING',
      '缺少必要的 Google Sheets API 環境變數：' +
        JSON.stringify({
          clientEmail: clientEmail ? '已設定' : '未設定',
          privateKey: privateKey ? '已設定' : '未設定',
          driveEndpoint: driveEndpoint ? '已設定' : '未設定',
        })
    )
  }
  const client = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: [driveEndpoint],
  })
  return google.sheets({ version: 'v4', auth: client })
}

export function getSheetUrl(year: GoogleSheetYear) {
  const sheetId =
    year === 'current' ? process.env.MAIN_SPREAD_SHEET_ID : process.env.NEXT_YEAR_SPREAD_SHEET_ID
  if (!sheetId) {
    // return empty string
    return ''
  }
  return `https://docs.google.com/spreadsheets/d/${sheetId}`
}
