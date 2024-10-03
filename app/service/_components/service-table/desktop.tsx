import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Row } from '@/app/type'
import { COLUMN_MAPPING, SHEET_FIELDS } from '@/app/const'
import { cn } from '@/lib/utils'

function ServiceTableRow({ row, index }: { row: Row; index: number }) {
  return (
    <TableRow
      className={cn(
        'dark:border-gray-700',
        index % 2 === 1 ? 'bg-gray-50 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'
      )}
    >
      {SHEET_FIELDS.map((key) => (
        <TableCell key={key} className="whitespace-nowrap text-center font-bold dark:text-gray-300">
          {row[key]}
        </TableCell>
      ))}
    </TableRow>
  )
}

export default function DesktopServiceTable({ rows }: { rows: Row[] }) {
  return (
    <div className="w-full overflow-auto dark:bg-gray-800">
      <Table>
        <TableHeader>
          <TableRow className="dark:border-gray-700">
            {SHEET_FIELDS.map((key) => (
              <TableHead
                key={key}
                className="whitespace-nowrap bg-gray-100 text-center font-bold dark:bg-gray-900 dark:text-gray-200"
              >
                {COLUMN_MAPPING[key]}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <ServiceTableRow key={index} row={row} index={index} />
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
