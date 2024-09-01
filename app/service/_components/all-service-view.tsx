'use client'

import { Accordion } from '@/components/ui/accordion'
import MonthlyAccordionItem from './monthly-accordion-item'
import { GoogleSheetResponse, Row } from '@/app/type'
import { cn } from '@/lib/utils'

export default function AllServiceView({
  data,
  className,
}: {
  data: GoogleSheetResponse['data']
  className?: string
}) {
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
    <Accordion
      type="single"
      className={cn('w-full', className)}
      collapsible
      defaultValue={thisMonth}
    >
      {Object.entries(groupedData).map(([key, rows]) => (
        <MonthlyAccordionItem key={key} month={key} rows={rows} />
      ))}
    </Accordion>
  )
}
