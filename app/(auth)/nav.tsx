'use client'

import React from 'react'
import { FaHome } from 'react-icons/fa'
import { RiCalendar2Fill, RiAccountCircleLine } from 'react-icons/ri'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { ClassValue } from 'clsx'
import { useRouter } from 'next/navigation'

const navInfo = [
  {
    name: '首頁',
    path: '/',
    icon: FaHome,
  },
  {
    name: '個人服事表',
    path: '/dashboard',
    icon: RiAccountCircleLine,
  },
  {
    name: '總表',
    path: '/full-calendar',
    icon: RiCalendar2Fill,
  },
]

const Nav = ({ className }: { className?: ClassValue }) => {
  const router = useRouter()
  const handleNavigation = (path: string) => {
    const url = new URL(window.location.href)
    const searchParams = url.search
    router.push(`${path}${searchParams}`)
  }

  return (
    <div className={cn('flex items-center justify-center space-x-4', className)}>
      {navInfo.map((navItem) => (
        <button
          key={navItem.path}
          className="flex items-center"
          onClick={() => handleNavigation(navItem.path)}
        >
          <navItem.icon className="h-8 w-8" />
          <span>{navItem.name}</span>
        </button>
      ))}
    </div>
  )
}

export default Nav
