'use client'

import { FaCalendarAlt } from 'react-icons/fa'
import { GoogleSheetResponse } from '../../_thirdParty/googleSheet'
import { SERVICE_TYPES, COLUMN_MAPPING, SERVICE_NOTES, SERVICE_TIME } from '@/app/const'
import { ServiceRecord, ServiceType } from '@/app/interface'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import ServiceCard from './service-card'

export default function CustomView({
  sheetData,
  userName,
}: {
  sheetData: GoogleSheetResponse
  userName: string
}) {
  const { data } = sheetData
  const [showPast, setShowPast] = useState(false)

  const new_services: ServiceRecord[] = []
  const past_services: ServiceRecord[] = []
  const now = new Date()

  data.forEach((row) => {
    SERVICE_TYPES.forEach((key) => {
      if (row[key] && row[key].includes(userName)) {
        // if service is prayer, change the date to 2 days earlier
        const date = new Date(row.date)
        if (key === 'prayer') {
          date.setDate(date.getDate() - 2)
        }
        const serviceRecord = { date, type: key, user: row[key] }
        if (date.getTime() >= now.getTime()) {
          new_services.push(serviceRecord)
        } else {
          past_services.push(serviceRecord)
        }
      }
    })
  })

  const createGoogleCalendarLink = (service: ServiceRecord) => {
    const baseUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE'
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
    return `${baseUrl}&text=${text}&dates=${startDateTime}/${endDateTime}&details=${details}`
  }

  return (
    <div className="flex-col p-6">
      <div className="mb-2 flex items-center space-x-2">
        <Switch id="show-past" onCheckedChange={setShowPast} />
        <Label htmlFor="show-past"> 顯示過往的服事 </Label>
      </div>
      {past_services.length > 0 &&
        showPast &&
        past_services
          .reverse()
          .map((service) => (
            <ServiceCard key={service.date.toLocaleDateString()} service={service} />
          ))}
      {new_services.reverse().map((service) => (
        <ServiceCard key={service.date.toLocaleDateString()} service={service} />
      ))}
    </div>
  )
}
