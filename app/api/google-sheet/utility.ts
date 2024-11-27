import { isValid } from 'date-fns'
import { google } from 'googleapis'
import { COLUMN_MAPPING_REVERSE } from '@/app/const'
import { GoogleSheetResponse, GoogleSheetYear, Row } from '@/app/type'

/**
 * Fetches data from a Google Sheet and processes it into a structured format.
 * @returns {Promise<GoogleSheetResponse>} A promise that resolves to the processed sheet data.
 */
export async function fetchGoogleSheetData(): Promise<GoogleSheetResponse> {
  // Validate environment variables
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  const driveEndpoint = process.env.GOOGLE_DRIVE_ENDPOINT || ''

  if (!clientEmail || !privateKey || !driveEndpoint) {
    throw new Error('Missing required environment variables for Google Sheets API')
  }
  // Initialize Google Auth client
  const client = new google.auth.JWT(clientEmail, undefined, privateKey, [driveEndpoint])

  const SHEET_RANGE = '總表!A:V'

  // Create Google Sheets API client
  const sheetClient = google.sheets({ version: 'v4', auth: client })

  // Fetch raw data from the Google Sheet
  const {
    data: { values: currentYearValues },
  } = await sheetClient.spreadsheets.values.get({
    spreadsheetId: process.env.MAIN_SPREAD_SHEET_ID,
    range: SHEET_RANGE,
  })

  // Destructure the values array, separating header row from data rows
  const [, headerRow, ...thisYearRestRows] = currentYearValues as string[][]

  // Get the rest of the rows from the next year's sheet
  let restRows = thisYearRestRows
  if (process.env.NEXT_YEAR_SPREAD_SHEET_ID) {
    const {
      data: { values: nextYearValues },
    } = await sheetClient.spreadsheets.values.get({
      spreadsheetId: process.env.NEXT_YEAR_SPREAD_SHEET_ID,
      range: SHEET_RANGE,
    })
    const [, , ...nextYearRestRows] = nextYearValues as string[][]
    restRows = [...thisYearRestRows, ...nextYearRestRows]
  }

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

export function getSheetUrl(year: GoogleSheetYear) {
  const sheetId =
    year === 'current' ? process.env.MAIN_SPREAD_SHEET_ID : process.env.NEXT_YEAR_SPREAD_SHEET_ID
  if (!sheetId) {
    // return empty string
    return ''
  }
  return `https://docs.google.com/spreadsheets/d/${sheetId}`
}
