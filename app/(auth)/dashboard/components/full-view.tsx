'use client'

import { Accordion } from '@/components/ui/accordion'
import { useStore } from '../state'
import MonthlyAccordionItem from './monthly-accordion-item'
import { Row } from '@/app/type'

export default function FullView() {
  const data = useStore((state) => state.sheetStatus.data)

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
        <MonthlyAccordionItem key={key} month={key} rows={rows} />
      ))}
    </Accordion>
  )
}
