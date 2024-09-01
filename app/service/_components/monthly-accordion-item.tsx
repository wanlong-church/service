'use client'

import { COLUMN_MAPPING, SHEET_FIELDS } from '@/app/const'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Row } from '@/app/type'
import useGoogleSheetUrl from '../_hooks/useGoogleSheetUrl'
import { Button } from '@/components/ui/button'

export default function MonthAccordionItem({ month, rows }: { month: string; rows: Row[] }) {
  const { data: sheetUrl } = useGoogleSheetUrl()
  return (
    <AccordionItem value={`${month}`}>
      <AccordionTrigger>{month} 月服事表 </AccordionTrigger>
      <AccordionContent className="flex items-center justify-center">
        <div className="flex flex-col gap-4 overflow-x-auto">
          <Button disabled={!sheetUrl} onClick={() => window.open(sheetUrl, '_blank')}>
            在 Google Sheet 表單中編輯
          </Button>
          <div className="flex overflow-x-auto">
            <MonthServiceTable rows={rows} />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function MonthServiceTable({ rows }: { rows: Row[] }) {
  return (
    <table className="relative overflow-x-auto shadow-md sm:rounded-lg">
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
    </table>
  )
}

function ServiceTableRow({ row }: { row: Row }) {
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
