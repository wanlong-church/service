import React from 'react'
import Nav from './nav'
import PageTitle from './page-title'

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-dvh w-screen flex-col overflow-y-auto">
      <header className="fixed left-0 right-0 top-0 z-10 h-16 bg-gray-200">
        <PageTitle />
      </header>
      <main className="mb-16 mt-16 w-screen flex-grow overflow-auto">{children}</main>
      <Nav className="fixed bottom-0 left-0 right-0 z-10 flex h-16 items-center justify-center bg-gray-200" />
    </div>
  )
}
