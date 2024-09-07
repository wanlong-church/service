import type React from 'react'
import Navigator from './_components/navigator'

export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex h-dvh flex-col">
      <div className="flex-1 overflow-y-auto p-3">{children}</div>
      <Navigator />
    </main>
  )
}
