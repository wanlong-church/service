import { isValid } from 'date-fns'
import { google } from 'googleapis'
import { COLUMN_MAPPING_REVERSE } from '../../../const'
import { SheetField } from '../../../interface'

/**
 * Represents a row of data from the Google Sheet.
 * Each key is a SheetField, and the corresponding value is a string.
 */
export type Row = Record<SheetField, string>

/**
 * The structure of the response from fetching Google Sheet data.
 */
export type GoogleSheetResponse = {
  /** An array of Row objects containing the sheet data. */
  data: Row[]
  error?: string
}

/**
 * Fetches data from a Google Sheet and processes it into a structured format.
 * @returns {Promise<GoogleSheetResponse>} A promise that resolves to the processed sheet data.
 */
export async function fetchGoogleSheetData(): Promise<GoogleSheetResponse> {
  // Initialize Google Auth client
  const client = new google.auth.JWT(
    process.env.GOOGLE_CLIENT_EMAIL,
    undefined,
    process.env.GOOGLE_PRIVATE_KEY,
    [process.env.GOOGLE_DRIVE_ENDPOINT || '']
  )

  // Create Google Sheets API client
  const sheetClient = google.sheets({ version: 'v4', auth: client })

  // Fetch raw data from the Google Sheet
  const {
    data: { values },
  } = await sheetClient.spreadsheets.values.get({
    spreadsheetId: process.env.MAIN_SPREAD_SHEET_ID,
    range: '總表!A:S',
  })

  // Destructure the values array, separating header row from data rows
  const [, headerRow, ...restRows] = values as string[][]

  // Process the raw data
  const data = restRows
    // Convert string[][] to Record<SheetField, string>
    .map((row) => {
      const rowMap: Row = {} as Row
      headerRow.forEach((header, index) => {
        if (COLUMN_MAPPING_REVERSE[header]) {
          rowMap[COLUMN_MAPPING_REVERSE[header]] = row[index]
        }
      })
      return rowMap
    })
    // Filter out rows with invalid dates (e.g., #REF fields)
    .filter<Row>((row: Row): row is Row => isValid(new Date(row.date)))
    // Sort by date, with newer service dates first
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return { data }
}

export function getSheetUrl() {
  return `https://docs.google.com/spreadsheets/d/${process.env.MAIN_SPREAD_SHEET_ID}`
}
