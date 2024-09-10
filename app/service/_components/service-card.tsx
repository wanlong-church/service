'use client'

import { FaCalendarAlt } from 'react-icons/fa'
import { COLUMN_MAPPING, SERVICE_NOTES, SERVICE_TIME } from '@/app/const'
import { ServiceRecord } from '@/app/type'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const BASE_CALENDAR_URL = 'https://calendar.google.com/calendar/render?action=TEMPLATE'

const createGoogleCalendarLink = (service: ServiceRecord) => {
  const text = encodeURIComponent(`${COLUMN_MAPPING[service.type]}: ${service.user}`)
  const formatDate = (date: Date, time: string) => {
    const [month, day, year] = [date.getMonth() + 1, date.getDate(), date.getFullYear()]
    const [hour, minute] = time.split(':')
    const pad = (num: number) => String(num).padStart(2, '0')
    return `${year}${pad(month)}${pad(day)}T${hour}${minute}00+8`
  }
  const startDateTime = formatDate(service.date, SERVICE_TIME[service.type].start)
  const endDateTime = formatDate(service.date, SERVICE_TIME[service.type].end)
  const details = encodeURIComponent(SERVICE_NOTES[service.type].join('\n'))
  return `${BASE_CALENDAR_URL}&text=${text}&dates=${startDateTime}/${endDateTime}&details=${details}`
}

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
              {note}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Button
          variant={'outline'}
          onClick={() => {
            const url = createGoogleCalendarLink(service)
            const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
            if (isMobile) {
              // avoid leaving empty tab on mobile
              window.location.href = url
            } else {
              window.open(url, '_blank', 'noopener,noreferrer')
            }
          }}
        >
          <FaCalendarAlt className="mr-2" />
          加入行事曆
        </Button>
      </CardFooter>
    </Card>
  )
}
