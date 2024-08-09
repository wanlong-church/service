'use client'

import { GoogleSheetResponse, Row } from '@/app/_thirdParty/googleSheet'
import { COLUMN_MAPPING, SHEET_FIELDS } from '@/app/const'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export default function FullView({ sheetData }: { sheetData: GoogleSheetResponse }) {
  const { data } = sheetData

  /** group data by year and month */
  const groupedData = data.reduce<Record<string, Row[]>>((acc, row) => {
    const date = new Date(row.date)
    const month = date.getMonth() + 1
    const year = date.getFullYear()
    const key = `${year}-${month}`
    acc[key] = acc[key] || []
    acc[key].push(row)
    return acc
  }, {})

  const today = new Date()
  const thisMonth = `${today.getFullYear()}-${today.getMonth() + 1}`

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue={thisMonth}>
      {Object.entries(groupedData).map(([key, rows]) => (
        <MonthAccordionItem key={key} month={key} rows={rows} />
      ))}
    </Accordion>
  )
}

const MonthAccordionItem = ({ month, rows }: { month: string; rows: Row[] }) => {
  return (
    <AccordionItem value={`${month}`}>
      <AccordionTrigger>{month} 月服事表 </AccordionTrigger>
      <AccordionContent className="flex items-center justify-center">
        {<MonthServiceTable rows={rows} />}
      </AccordionContent>
    </AccordionItem>
  )
}

const MonthServiceTable = ({ rows }: { rows: Row[] }) => {
  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          {SHEET_FIELDS.map((key) => (
            <th key={key} className="px-6 py-3">
              {COLUMN_MAPPING[key]}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <ServiceTableRow key={index} row={row} />
        ))}
      </tbody>
    </div>
  )
}

const ServiceTableRow = ({ row }: { row: Row }) => {
  return (
    <tr className="border-b odd:bg-white even:bg-gray-50 dark:border-gray-700 odd:dark:bg-gray-900 even:dark:bg-gray-800">
      {SHEET_FIELDS.map((key) => (
        <td
          key={key}
          className="whitespace-nowrap px-6 py-4 font-medium text-gray-900 dark:text-white"
        >
          {row[key]}
        </td>
      ))}
    </tr>
  )
}
