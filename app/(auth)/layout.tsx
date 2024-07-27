import React from 'react'
import Nav from './nav'
import PageTitle from './page-title'

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-screen max-h-screen w-screen flex-col overflow-y-auto bg-white">
      <PageTitle />
      <div className="h-[calc(100svh-90px)] overflow-auto">{children}</div>
      <div className="border-t bg-gray-200 p-3">
        <Nav />
      </div>
    </div>
  )
}
