'use client'

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Row } from '@/app/type'
import { Button } from '@/components/ui/button'
import { useMediaQuery } from '@/hooks/use-media-query'
import { DesktopServiceTable, MobileServiceTable } from './service-table'

export default function MonthAccordionItem({
  month,
  rows,
  sheetUrl,
}: {
  month: string
  rows: Row[]
  sheetUrl: string
}) {
  const { isLargeDevice } = useMediaQuery()
  return (
    <AccordionItem value={`${month}`} id={`${month}`}>
      <AccordionTrigger>{month} 月服事表 </AccordionTrigger>
      <AccordionContent className="flex items-center justify-center">
        <div className="flex w-full flex-col gap-4 overflow-x-auto">
          <Button disabled={!sheetUrl} onClick={() => window.open(sheetUrl, '_blank')}>
            在 Google Sheet 表單中編輯
          </Button>
          <div className="flex overflow-x-auto">
            {isLargeDevice ? (
              <DesktopServiceTable rows={rows} />
            ) : (
              <MobileServiceTable rows={rows} />
            )}
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  )
}
