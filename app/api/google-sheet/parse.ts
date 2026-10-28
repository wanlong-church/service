import { isValid } from 'date-fns'
import { COLUMN_ALIASES, COLUMN_MAPPING, SHEET_FIELDS, SHEET_TAB } from '@/app/const'
import { GoogleSheetYear, Row, SheetField } from '@/app/type'
import { SHEET_LABEL, SheetError } from './errors'

/** The header row must be within this many rows from the top of the tab */
const HEADER_SEARCH_ROWS = 5

/**
 * A cell value that Google Sheets renders for a broken formula, e.g. #REF! from a
 * cross-tab reference whose row was deleted. Never a person's name or a date.
 */
const SPREADSHEET_ERROR = /^#(REF!|N\/A|VALUE!|DIV\/0!|NAME\?|NUM!|ERROR!|NULL!)/

/**
 * The result of parsing one sheet's 總表 tab.
 */
export type ParsedSheet = {
  /** Rows with a valid date, in sheet order. */
  rows: Row[]
  /** Fields whose header was not found. */
  missingFields: SheetField[]
  /** Non-empty headers that match no field, e.g. 貝士 and 鼓. */
  unmatchedHeaders: string[]
  /** Rows dropped because their date is not empty but cannot be parsed. */
  invalidDates: { rowNumber: number; value: string }[]
  /** Cells whose spreadsheet error value was replaced with an empty string. */
  issues: SheetIssue[]
}

/** One cell that held a spreadsheet error value such as #REF!. */
export type SheetIssue = {
  sheet: GoogleSheetYear
  /** The 1-based row number in the sheet. */
  rowNumber: number
  /** The row's date cell value; '' when the date cell itself is the error. */
  date: string
  field: SheetField
  /** An A1 reference into the sheet, e.g. 總表!M54. */
  cell: string
  /** The original error value, e.g. '#REF!'. */
  value: string
}

/** Turns a zero-based column index into A1 letters (the sheet range is A:Z, so usually one letter) */
function toColumnLetters(column: number): string {
  let letters = ''
  let index = column
  while (index >= 0) {
    letters = String.fromCharCode((index % 26) + 65) + letters
    index = Math.floor(index / 26) - 1
  }
  return letters
}

/**
 * Normalizes a header so that formatting drift still matches: NFKC turns full-width
 * characters such as （） and １ into ASCII, and all whitespace is removed.
 */
export function normalizeHeader(header: string): string {
  return header.normalize('NFKC').replace(/\s+/g, '')
}

/** Normalized header text → field, including the aliases */
const HEADER_TO_FIELD = new Map<string, SheetField>(
  SHEET_FIELDS.flatMap((field) =>
    [COLUMN_MAPPING[field], ...(COLUMN_ALIASES[field] ?? [])].map(
      (header) => [normalizeHeader(header), field] as const
    )
  )
)

/**
 * Parses one sheet's 總表 tab into rows, using that sheet's own header row.
 * @param values The tab's cell values, starting at row 1 so that row numbers match the sheet.
 * @param sheet The sheet being parsed, used in error messages.
 * @throws {SheetError} NO_VALID_ROWS when no header is found near the top, or no row has a valid date.
 */
export function parseRosterSheet(values: string[][], sheet: GoogleSheetYear): ParsedSheet {
  const label = `${SHEET_LABEL[sheet]}的「${SHEET_TAB}」分頁`
  const headerIndex = values
    .slice(0, HEADER_SEARCH_ROWS)
    .findIndex((row) => row.some((cell) => HEADER_TO_FIELD.get(normalizeHeader(cell)) === 'date'))
  if (headerIndex === -1) {
    throw new SheetError(
      'NO_VALID_ROWS',
      `${label}前 ${HEADER_SEARCH_ROWS} 列找不到含「${COLUMN_MAPPING.date}」的表頭`,
      sheet
    )
  }

  // Map each field to its column; if two headers match the same field, the first one wins
  const fieldColumns = new Map<SheetField, number>()
  const unmatchedHeaders: string[] = []
  values[headerIndex].forEach((header, column) => {
    const field = HEADER_TO_FIELD.get(normalizeHeader(header))
    if (!field) {
      if (header.trim()) unmatchedHeaders.push(header)
    } else if (!fieldColumns.has(field)) {
      fieldColumns.set(field, column)
    }
  })
  const missingFields = SHEET_FIELDS.filter((field) => !fieldColumns.has(field))

  const rows: Row[] = []
  const invalidDates: ParsedSheet['invalidDates'] = []
  const issues: SheetIssue[] = []
  // The date field is always mapped: the header was found by its 日期 cell
  const dateColumn = fieldColumns.get('date')!
  values.slice(headerIndex + 1).forEach((cells, offset) => {
    const rowNumber = headerIndex + offset + 2
    // Read the date cell directly; header order is not guaranteed, so row.date may not be set yet
    const dateCell = cells[dateColumn] ?? ''
    const cellRef = (column: number) => `${SHEET_TAB}!${toColumnLetters(column)}${rowNumber}`
    // A date cell holding an error value counts as blank: report it and drop the row
    if (SPREADSHEET_ERROR.test(dateCell)) {
      issues.push({
        sheet,
        rowNumber,
        date: '',
        field: 'date',
        cell: cellRef(dateColumn),
        value: dateCell,
      })
      return
    }
    // Skip blank rows without reporting them
    if (!dateCell.trim()) return
    // Drop and report rows whose date cannot be parsed
    if (!isValid(new Date(dateCell))) {
      invalidDates.push({ rowNumber, value: dateCell })
      return
    }
    const row = {} as Row
    fieldColumns.forEach((column, field) => {
      const value = cells[column] ?? ''
      if (SPREADSHEET_ERROR.test(value)) {
        issues.push({ sheet, rowNumber, date: dateCell, field, cell: cellRef(column), value })
        row[field] = ''
      } else {
        row[field] = value
      }
    })
    rows.push(row)
  })
  if (rows.length === 0) {
    throw new SheetError(
      'NO_VALID_ROWS',
      `${label}沒有任何日期有效的資料列，請確認「${COLUMN_MAPPING.date}」欄的內容`,
      sheet
    )
  }

  return { rows, missingFields, unmatchedHeaders, invalidDates, issues }
}
