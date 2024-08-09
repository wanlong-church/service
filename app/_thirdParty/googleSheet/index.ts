import { isValid } from 'date-fns'
import { google } from 'googleapis'
import { cache } from 'react'
import { COLUMN_MAPPING_REVERSE } from '../../const'
import { SheetField } from '../../interface'
export type Column = {
  id: SheetField
  name: string
}
export type Row = Record<SheetField, string>
export type GoogleSheetResponse = { data: Row[] }
/** 取得服事表總表資料
 * @param timestamp - seed for cache，若要取得最新資料則需要使用新的 timestamp，否則只會回傳快取的資料
 * */
const TIME_STAMP = new Date().getTime()
export const fetchGoogleSheetData = cache(
  async (timestamp: number = TIME_STAMP): Promise<GoogleSheetResponse> => {
    /** TODO: server 給第一次資料後，client 後面如果需要新資料可以考慮建立一個 route 或 server action */
    const client = new google.auth.JWT(
      process.env.GOOGLE_CLIENT_EMAIL,
      undefined,
      process.env.GOOGLE_PRIVATE_KEY,
      [process.env.GOOGLE_DRIVE_ENDPOINT || '']
    )
    const sheetClient = google.sheets({ version: 'v4', auth: client })
    const {
      data: { values },
    } = await sheetClient.spreadsheets.values.get({
      spreadsheetId: process.env.MAIN_SPREAD_SHEET_ID,
      range: '總表!A:S',
    })
    const [, headerRow, ...restRows] = values as string[][]

    const data = restRows
      /** 將 string[][] 轉換成 Record<SheetField, string> */
      .map((row) => {
        const rowMap: Row = {} as Row
        headerRow.forEach((header, index) => {
          if (COLUMN_MAPPING_REVERSE[header]) {
            rowMap[COLUMN_MAPPING_REVERSE[header]] = row[index]
          }
        })
        return rowMap
      })
      /** 將非法日期的選項排除 a.k.a #REF 欄位 */
      .filter<Row>((row: Row): row is Row => isValid(new Date(row.date)))
      /** 依據時機遠近排序，新的服事排前面 */
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return { data }
  }
)
