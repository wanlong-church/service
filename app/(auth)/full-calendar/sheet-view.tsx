'use client'

import { endOfWeek, getYear, isWithinInterval, startOfWeek } from 'date-fns'
import { use, useEffect } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Column, GoogleSheetResponse, Row } from '../../_thirdParty/googleSheet'

const SheetView = ({ sheetDataPromise }: { sheetDataPromise: Promise<GoogleSheetResponse> }) => {
  const sheetData = use<GoogleSheetResponse>(sheetDataPromise)
  const { header, data } = sheetData

  /** 將 data 依照「年份」分組 */
  const groupedData = data.reduce<Record<string, Row[]>>((acc, row) => {
    const year = getYear(new Date(row.date))
    acc[year] = acc[year] || []
    acc[year].push(row)
    return acc
  }, {})

  /** 控制要渲染的欄位 */
  const renderHeader = header.filter((column) => column.id !== 'date')

  /** 預設頁面滑至當週的開合選單 */
  useEffect(() => {
    const index = data.findIndex((row) => isDateInThisWeek(new Date(row.date)))
    /** scroll margin 找不到解法，先定位到上一個元素呈現同一個效果 */
    const thisWeekService = index > 0 ? data[index - 1] : data[0]
    const elementId = generateSheetAccordionId(new Date(thisWeekService.date))
    const element = document.getElementById(elementId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      try {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } catch (error) {
        // Fallback for browsers that do not support smooth scrolling
        element.scrollIntoView()
      }
    }
  }, [data])

  return (
    <div>
      {Object.entries(groupedData)
        .sort(([aYear], [bYear]) => parseInt(bYear) - parseInt(aYear))
        .map(([year, rows]) => {
          /** 預設開啟當週服事 */
          const thisWeekIndex = rows.findIndex((row) => isDateInThisWeek(new Date(row.date)))
          const defaultIndex = ~thisWeekIndex ? [thisWeekIndex] : void 0

          return (
            <div key={year} className="relative" id={`dog${year}`}>
              <div className="sticky top-0 z-10 mb-2 bg-gray-400 p-2">
                <h2 className="text-center text-2xl font-bold">{year}</h2>
              </div>
              <SheetAccordion rows={rows} header={renderHeader} defaultIndex={defaultIndex} />
            </div>
          )
        })}
    </div>
  )
}

const SheetAccordion = ({
  rows,
  header,
  defaultIndex = [],
}: {
  rows: Row[]
  header: Column[]
  defaultIndex?: number[]
}) => {
  return (
    <Accordion type="multiple" defaultValue={defaultIndex.map(String)}>
      {rows.map((row, index) => (
        <SheetAccordionItem key={index} row={row} header={header} index={index} />
      ))}
    </Accordion>
  )
}

const SheetAccordionItem = ({
  row,
  header,
  index,
}: {
  row: Row
  header: Column[]
  index: number
}) => {
  const date = new Date(row.date)
  const title = `${date.getMonth() + 1} 月 ${date.getDate()} 日`
  return (
    <div id={generateSheetAccordionId(date)}>
      <AccordionItem value={String(index)}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          {header.map((column, idx) => (
            <div key={idx}>
              {column.name}: {row[column.id]}
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </div>
  )
}

//#region utils function
/** 判斷日期是否在本週 */
const isDateInThisWeek = (date: Date) => {
  const today = new Date()
  /** 確認年份相同 */
  const isSameYear = getYear(today) === getYear(date)
  /** 獲取本週的第一天（星期一）和最後一天（星期日）*/
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 })
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 })

  return isSameYear && isWithinInterval(date, { start: startOfThisWeek, end: endOfThisWeek })
}
/** 生成 sheetAccordionItem 的共用 id */
const generateSheetAccordionId = (date: Date = new Date()) => `sheetAccordionItem_${date.getTime()}`
//#endregion

export default SheetView
