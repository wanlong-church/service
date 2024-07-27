import { isValid } from 'date-fns'
import { google } from 'googleapis'
import { cache } from 'react'
import { TIME_STAMP } from '@/app/const'
import { SHEET_COLUMN_ORDER } from './const'
import { SheetFieldKey } from './interface'
export type Column = {
  id: SheetFieldKey
  name: string
}
export type Row = Record<SheetFieldKey, string>
export type GoogleSheetResponse = { header: Column[]; data: Row[] }
/** 取得服事表總表資料
 * @param timestamp - seed for cache，若要取得最新資料則需要使用新的 timestamp，否則只會回傳快取的資料
 * */
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
      range: '2024總表!A:U',
    })
    const [, headerRow, ...restRows] = values as string[][]
    const header = headerRow.map<Column>((cell, index) => ({
      id: SHEET_COLUMN_ORDER[index],
      name: cell,
    }))
    const data = restRows
      /** 將 string[][] 轉換成 Record<SheetFieldKey, string> */
      .map<Row>((row) =>
        row.reduce(
          (acc, cell, index) => {
            const id = SHEET_COLUMN_ORDER[index]
            acc[id] = cell
            return acc
          },
          {} as Record<SheetFieldKey, string>
        )
      )
      /** 將非法日期的選項排除 a.k.a #REF 欄位 */
      .filter<Row>((row: Row): row is Row => isValid(new Date(row.date)))
      /** 依據時機遠近排序，新的服事排前面 */
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      header,
      data,
    }
  }
)
