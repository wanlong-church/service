'use client'

import { COLUMN_MAPPING, SHEET_FIELDS } from '@/app/const'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { useStore } from '../state'
import { Row } from '@/app/type'

export default function MonthAccordionItem({ month, rows }: { month: string; rows: Row[] }) {
  const sheetUrl = useStore((state) => state.sheetStatus.url)
  return (
    <AccordionItem value={`${month}`}>
      <AccordionTrigger>{month} 月服事表 </AccordionTrigger>
      <AccordionContent className="flex items-center justify-center">
        <div className="flex flex-col gap-4">
          <button
            onClick={() => window.open(sheetUrl, '_blank')}
            className="rounded bg-blue-500 px-4 py-2 font-semibold text-white transition duration-300 ease-in-out hover:bg-blue-600"
          >
            在 Google Sheet 表單中編輯
          </button>
          <MonthServiceTable rows={rows} />
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}

function MonthServiceTable({ rows }: { rows: Row[] }) {
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
