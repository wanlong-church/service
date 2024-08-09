import { COLUMN_MAPPING, SERVICE_NOTES, SERVICE_TIME } from '@/app/const'
import { ServiceRecord } from '@/app/interface'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { FaCalendarAlt } from 'react-icons/fa'

export default function ServiceCard({ service }: { service: ServiceRecord }) {
  return (
    <Card
      key={service.date.toLocaleDateString()}
      id={service.date.toLocaleDateString()}
      className="mb-4 scroll-m-20"
    >
      <CardHeader>
        <CardTitle>
          {service.date.toLocaleDateString()} {COLUMN_MAPPING[service.type]}
        </CardTitle>
        <CardDescription>
          <p>
            {COLUMN_MAPPING[service.type]}: {service.user}
          </p>
          <p>
            {SERVICE_TIME[service.type].start} - {SERVICE_TIME[service.type].end}
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {SERVICE_NOTES[service.type].map((note) => (
            <li key={note} className="mb-2">
              {' '}
              {note}{' '}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={'outline'}
          onClick={() => {
            const url = createGoogleCalendarLink(service)
            window.open(url, '_blank', 'noopener,noreferrer')
          }}
        >
          <FaCalendarAlt className="mr-2" />
          加入行事曆
        </Button>
      </CardFooter>
    </Card>
  )
}
