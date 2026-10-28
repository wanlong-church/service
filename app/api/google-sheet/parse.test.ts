import { describe, expect, it } from 'vitest'
import { COLUMN_MAPPING, SHEET_FIELDS } from '@/app/const'
import { Row } from '@/app/type'
import { SheetError } from './errors'
import { parseRosterSheet } from './parse'

/** The 總表 header row as it is in the 2026 and 2027 sheets */
const HEADER = [
  '日期',
  '講員',
  '領會',
  '擘餅',
  '司琴',
  '合音1',
  '合音2',
  '吉他',
  '貝士',
  '鼓',
  '投影片',
  '音控直播',
  '兒主中年級',
  '幼兒主理',
  '招待',
  '禱告會',
  '愛筵',
  '洗碗',
  '特別日子',
  '講台主題',
  '(中小級)聚會內容',
  '(初小級)聚會內容',
]

/** A data row whose cells are `<header>@<date>`, so tests can tell which column each value came from */
const dataRow = (header: string[], date: string) =>
  header.map((cell) => (cell === '日期' ? date : `${cell}@${date}`))

/** Replaces header cells, e.g. to retype a header the way someone might in the sheet */
const retype = (replacements: Record<string, string>) =>
  HEADER.map((cell) => replacements[cell] ?? cell)

/** Checks that every field holds the cell from its own column */
function expectMappedRow(row: Row, date: string) {
  SHEET_FIELDS.forEach((field) => {
    expect(row[field]).toBe(field === 'date' ? date : `${COLUMN_MAPPING[field]}@${date}`)
  })
}

function parseError(values: string[][]) {
  try {
    parseRosterSheet(values, 'next')
  } catch (error) {
    return error
  }
  throw new Error('parseRosterSheet did not throw')
}

describe('parseRosterSheet', () => {
  it('parses the current layout: empty row 1, header in row 2', () => {
    const { rows, missingFields, unmatchedHeaders, invalidDates } = parseRosterSheet(
      [[], HEADER, dataRow(HEADER, '1/4/2026'), dataRow(HEADER, '1/11/2026')],
      'current'
    )
    expect(rows).toHaveLength(2)
    expectMappedRow(rows[0], '1/4/2026')
    expectMappedRow(rows[1], '1/11/2026')
    expect(missingFields).toEqual([])
    expect(unmatchedHeaders).toEqual(['貝士', '鼓'])
    expect(invalidDates).toEqual([])
  })

  it('finds the header when a row is inserted above it', () => {
    const { rows } = parseRosterSheet(
      [[], ['2026年服事表'], HEADER, dataRow(HEADER, '1/4/2026')],
      'current'
    )
    expect(rows).toHaveLength(1)
    expectMappedRow(rows[0], '1/4/2026')
  })

  it('throws NO_VALID_ROWS when the header is not in the first 5 rows', () => {
    const error = parseError([[], [], [], [], [], HEADER, dataRow(HEADER, '1/4/2026')])
    expect(error).toBeInstanceOf(SheetError)
    expect(error).toMatchObject({ code: 'NO_VALID_ROWS', sheet: 'next' })
  })

  it('throws NO_VALID_ROWS for an empty tab', () => {
    expect(parseError([])).toMatchObject({ code: 'NO_VALID_ROWS' })
  })

  it('throws NO_VALID_ROWS when no row has a valid date', () => {
    expect(parseError([[], HEADER])).toMatchObject({ code: 'NO_VALID_ROWS' })
    expect(parseError([[], HEADER, dataRow(HEADER, '#REF!')])).toMatchObject({
      code: 'NO_VALID_ROWS',
    })
  })

  it('matches headers with full-width characters and stray spaces', () => {
    const header = retype({
      '(中小級)聚會內容': '（中小級）聚會內容',
      講員: '講員 ',
      合音1: '合音１',
      兒主中年級: '兒主　中年級',
    })
    const { rows, missingFields } = parseRosterSheet(
      [[], header, dataRow(header, '1/4/2026')],
      'current'
    )
    expect(missingFields).toEqual([])
    expect(rows[0].sundaySchool1Topic).toBe('（中小級）聚會內容@1/4/2026')
    expect(rows[0].speaker).toBe('講員 @1/4/2026')
    expect(rows[0].choir1).toBe('合音１@1/4/2026')
    expect(rows[0].sundaySchool1).toBe('兒主　中年級@1/4/2026')
  })

  it('matches the aliases 愛宴 and 音控', () => {
    const header = retype({ 愛筵: '愛宴', 音控直播: '音控' })
    const { rows, missingFields } = parseRosterSheet(
      [[], header, dataRow(header, '1/4/2026')],
      'current'
    )
    expect(missingFields).toEqual([])
    expect(rows[0].meal).toBe('愛宴@1/4/2026')
    expect(rows[0].soundControl).toBe('音控@1/4/2026')
  })

  it('reports fields whose header is missing', () => {
    const header = retype({ 洗碗: '清潔' })
    const { rows, missingFields, unmatchedHeaders } = parseRosterSheet(
      [[], header, dataRow(header, '1/4/2026')],
      'current'
    )
    expect(missingFields).toEqual(['dishWashing'])
    expect(unmatchedHeaders).toEqual(['貝士', '鼓', '清潔'])
    expect(rows[0].dishWashing).toBeUndefined()
  })

  it('maps each sheet by its own column order', () => {
    const header = [...HEADER].reverse()
    const { rows } = parseRosterSheet([[], header, dataRow(header, '1/3/2027')], 'next')
    expectMappedRow(rows[0], '1/3/2027')
  })

  it('maps columns inserted before and after 日期', () => {
    const header = ['備註', ...HEADER.slice(0, 12), '直播', ...HEADER.slice(12)]
    const { rows, unmatchedHeaders } = parseRosterSheet(
      [[], header, dataRow(header, '1/4/2026')],
      'current'
    )
    expectMappedRow(rows[0], '1/4/2026')
    expect(unmatchedHeaders).toEqual(['備註', '貝士', '鼓', '直播'])
  })

  it('drops and reports rows with an unparseable date, and skips blank rows', () => {
    const { rows, invalidDates } = parseRosterSheet(
      [
        [],
        HEADER,
        dataRow(HEADER, '1/4/2026'), // row 3
        dataRow(HEADER, '#REF!'), // row 4
        [], // row 5
        dataRow(HEADER, ''), // row 6
        dataRow(HEADER, '1/18/2026'), // row 7
      ],
      'current'
    )
    expect(rows.map((row) => row.date)).toEqual(['1/4/2026', '1/18/2026'])
    expect(invalidDates).toEqual([{ rowNumber: 4, value: '#REF!' }])
  })

  it('uses the first column when two headers match the same field', () => {
    const header = [...HEADER, '愛宴']
    const { rows, unmatchedHeaders } = parseRosterSheet(
      [[], header, dataRow(header, '1/4/2026')],
      'current'
    )
    expect(rows[0].meal).toBe('愛筵@1/4/2026')
    expect(unmatchedHeaders).toEqual(['貝士', '鼓'])
  })
})
