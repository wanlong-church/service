'use client'

import { SERVICE_TYPES } from '@/app/const'
import { ServiceRecord } from '@/app/interface'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import ServiceCard from './service-card'
import { GoogleSheetResponse } from '../api/google-sheet/utility'

export default function CustomView({
  sheetData,
  user,
}: {
  sheetData: GoogleSheetResponse
  user: string
}) {
  const { data } = sheetData
  const [showPast, setShowPast] = useState(false)

  const newServices: ServiceRecord[] = []
  const pastServices: ServiceRecord[] = []
  const now = new Date()

  data.forEach((row) => {
    SERVICE_TYPES.forEach((key) => {
      if (row[key] && row[key].includes(user)) {
        // if service is prayer, change the date to 2 days earlier
        const date = new Date(row.date)
        if (key === 'prayer') {
          date.setDate(date.getDate() - 2)
        }
        const serviceRecord = { date, type: key, user: row[key] }
        if (date.getTime() >= now.getTime()) {
          newServices.push(serviceRecord)
        } else {
          pastServices.push(serviceRecord)
        }
      }
    })
  })

  return (
    <div className="flex-col p-6">
      <div className="mb-2 flex items-center space-x-2">
        <Switch id="show-past" onCheckedChange={setShowPast} />
        <Label htmlFor="show-past"> 顯示過往的服事 </Label>
      </div>
      {pastServices.length > 0 &&
        showPast &&
        pastServices
          .reverse()
          .map((service) => (
            <ServiceCard key={service.date.toLocaleDateString()} service={service} />
          ))}
      {newServices.reverse().map((service) => (
        <ServiceCard key={service.date.toLocaleDateString()} service={service} />
      ))}
    </div>
  )
}
