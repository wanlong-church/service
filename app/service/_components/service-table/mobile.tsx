import { Row } from '@/app/type'
import { COLUMN_MAPPING, SHEET_FIELDS } from '@/app/const'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { addDays, startOfWeek } from 'date-fns'
import { cn, safeFormatDate } from '@/lib/utils'

interface MobileServiceTableProps {
  rows: Row[]
}

export default function MobileServiceTable({ rows }: MobileServiceTableProps) {
  const thisWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const thisWeekEnd = addDays(thisWeekStart, 6)
  const defaultSelectDate =
    rows.find(({ date }) => {
      const rowDate = new Date(date)
      return rowDate >= thisWeekStart && rowDate <= thisWeekEnd
    })?.date ?? rows[0].date
  const [selectedDate, setSelectedDate] = useState<string>(defaultSelectDate)
  const selectedRow = rows.find(({ date }) => date === selectedDate)

  return (
    <div className="w-full space-y-4">
      <div className="mb-4 flex flex-wrap gap-2">
        {rows.map(({ date }) => (
          <Button
            key={date}
            onClick={() => setSelectedDate(date)}
            variant={selectedDate === date ? 'default' : 'outline'}
            className={cn(
              'rounded-full',
              selectedDate === date
                ? 'bg-green-500 text-white hover:bg-green-600 dark:bg-green-600 dark:text-white dark:hover:bg-green-700'
                : 'bg-background text-foreground hover:bg-accent hover:text-accent-foreground dark:bg-background dark:text-foreground dark:hover:bg-accent dark:hover:text-accent-foreground'
            )}
          >
            {safeFormatDate(date, 'MM月d日')}
          </Button>
        ))}
      </div>
      {selectedRow && <ServiceCard row={selectedRow} />}
    </div>
  )
}

function ServiceCard({ row }: { row: Row }) {
  return (
    <Card className="mb-4 w-full border-gray-200 dark:border-gray-600">
      <CardHeader className="bg-white dark:bg-gray-800">
        <CardTitle className="truncate text-center font-bold text-gray-800 dark:text-gray-200">
          {safeFormatDate(row[SHEET_FIELDS[0]], 'MM月d日')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-gray-200 dark:divide-gray-600">
          {SHEET_FIELDS.slice(1).map((key, index) => (
            <div
              key={key}
              className={`flex px-4 py-2 ${index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-100 dark:bg-gray-700'}`}
            >
              <div className="w-1/2 text-left font-bold text-gray-600 dark:text-gray-400">
                {COLUMN_MAPPING[key]}
              </div>
              <div className="w-1/2 text-left font-bold break-words text-gray-800 dark:text-gray-200">
                {row[key]}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
