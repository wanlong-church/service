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
import { useSearchParams } from 'next/navigation'

const SheetView = ({ sheetDataPromise }: { sheetDataPromise: Promise<GoogleSheetResponse> }) => {
  const searchParams = useSearchParams()
  const userName = searchParams.get('user') || ''
  const sheetData = use<GoogleSheetResponse>(sheetDataPromise)
  const { header, data } = sheetData

  /** Filter data by user name */
  const filteredData = data.filter((row) =>
    Object.values(row).some((value) => value.toString().includes(userName))
  )

  /** group data by year */
  const groupedData = filteredData.reduce<Record<string, Row[]>>((acc, row) => {
    const year = getYear(new Date(row.date))
    acc[year] = acc[year] || []
    acc[year].push(row)
    return acc
  }, {})

  /** filter out columns to render */
  const renderHeader = header.filter((column) => column.id !== 'date')

  /** scroll to this week */
  useEffect(() => {
    const index = filteredData.findIndex((row) => isDateInThisWeek(new Date(row.date)))
    /** scroll margin 找不到解法，先定位到上一個元素呈現同一個效果 */
    const thisWeekService = index > 0 ? filteredData[index - 1] : filteredData[0]
    const elementId = generateSheetAccordionId(new Date(thisWeekService.date))
    const element = document.getElementById(elementId)
    if (element) {
      try {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } catch (error) {
        // Fallback for browsers that do not support smooth scrolling
        element.scrollIntoView()
      }
    }
  }, [filteredData])

  return (
    <div>
      {Object.entries(groupedData)
        .sort(([aYear], [bYear]) => parseInt(bYear) - parseInt(aYear))
        .map(([year, rows]) => {
          /** open this week's SheetAccordion */
          const thisWeekIndex = rows.findIndex((row) => isDateInThisWeek(new Date(row.date)))
          const defaultIndex = ~thisWeekIndex ? [thisWeekIndex] : void 0

          return (
            <div key={year} id={`year-${year}`}>
              <div className="sticky z-10 mb-2 bg-gray-400 p-2">
                <h2 className="text-center text-2xl font-bold">{year}</h2>
              </div>
              <SheetAccordion
                rows={rows}
                header={renderHeader}
                defaultIndex={defaultIndex}
                userName={userName}
              />
            </div>
          )
        })}
    </div>
  )
}

const SheetAccordion = ({
  rows,
  header,
  userName,
  defaultIndex = [],
}: {
  rows: Row[]
  header: Column[]
  userName: string
  defaultIndex?: number[]
}) => {
  return (
    <Accordion type="multiple" defaultValue={defaultIndex.map(String)}>
      {rows.map((row, index) => (
        <SheetAccordionItem
          key={index}
          row={row}
          header={header}
          index={index}
          userName={userName}
        />
      ))}
    </Accordion>
  )
}

const SheetAccordionItem = ({
  row,
  header,
  index,
  userName,
}: {
  row: Row
  header: Column[]
  index: number
  userName: string
}) => {
  const date = new Date(row.date)
  const services = header.filter((column) => row[column.id]?.includes(userName))
  const title = `${date.getMonth() + 1} 月 ${date.getDate()} 日 ${services.map((s) => s.name).join(' ')}`

  return (
    <div id={generateSheetAccordionId(date)}>
      <AccordionItem value={String(index)}>
        <AccordionTrigger>{title}</AccordionTrigger>
        <AccordionContent>
          {header.map(
            (column, idx) =>
              row[column.id]?.includes(userName) && (
                <div key={idx}>
                  {column.name}: {row[column.id]}
                </div>
              )
          )}
        </AccordionContent>
      </AccordionItem>
    </div>
  )
}

/** check if date is in this week */
const isDateInThisWeek = (date: Date) => {
  const today = new Date()
  /** check if date is in the same year */
  const isSameYear = getYear(today) === getYear(date)
  /** getting the start and end of this week */
  const startOfThisWeek = startOfWeek(today, { weekStartsOn: 1 })
  const endOfThisWeek = endOfWeek(today, { weekStartsOn: 1 })

  return isSameYear && isWithinInterval(date, { start: startOfThisWeek, end: endOfThisWeek })
}
/** generate sheet accordion id */
const generateSheetAccordionId = (date: Date = new Date()) => `sheetAccordionItem_${date.getTime()}`
//#endregion

export default SheetView
