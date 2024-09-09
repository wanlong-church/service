'use client'
import { useMemo, useState } from 'react'
import { subDays, compareAsc, isBefore } from 'date-fns'
import { SERVICE_TYPES } from '@/app/const'
import { GoogleSheetResponse, ServiceRecord } from '@/app/type'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import ServiceCard from './service-card'

export default function PersonalView({
  data,
  user,
}: {
  data: GoogleSheetResponse['data']
  user: string
}) {
  const [showPast, setShowPast] = useState(false)
  const { newServices, pastServices } = useMemo(() => {
    const newServices: ServiceRecord[] = []
    const pastServices: ServiceRecord[] = []
    const now = new Date()

    structuredClone(data).forEach(({ date, ...restRow }) => {
      SERVICE_TYPES.forEach((key) => {
        const matchService = restRow[key] && restRow[key].includes(user)
        if (!matchService) return
        /**
         * 禱告會的日期為星期五，所以需要減去兩天
         * 轉換後對時間排序才準確
         **/
        const resolvedDate = key === 'prayer' ? subDays(new Date(date), 2) : new Date(date)
        const serviceRecord = { date: resolvedDate, type: key, user: restRow[key] }
        if (isBefore(resolvedDate, now)) pastServices.push(serviceRecord)
        else newServices.push(serviceRecord)
      })
    })
    newServices.sort((a, b) => compareAsc(a.date, b.date))
    pastServices.sort((a, b) => compareAsc(a.date, b.date))
    return { newServices, pastServices }
  }, [data, user])
  return (
    <div className="flex-col p-6">
      <div className="mb-2 flex items-center space-x-2">
        <Switch id="show-past" onCheckedChange={setShowPast} />
        <Label htmlFor="show-past"> 顯示過往的服事 </Label>
      </div>
      {pastServices.length > 0 &&
        showPast &&
        pastServices.map((service) => (
          <ServiceCard key={service.date.toLocaleDateString() + service.type} service={service} />
        ))}
      {newServices.map((service) => (
        <ServiceCard key={service.date.toLocaleDateString() + service.type} service={service} />
      ))}
    </div>
  )
}
