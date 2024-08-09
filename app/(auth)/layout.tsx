import React from 'react'

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex h-dvh overflow-y-auto">
      <main className="w-full p-3">{children}</main>
    </div>
  )
}
