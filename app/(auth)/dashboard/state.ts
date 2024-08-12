import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

import { DashboardMode, DashboardState } from '@/app/interface'

export const useStore = create<DashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        mode: 'all',
        user: '',
        setMode: (mode: DashboardMode) => set({ mode }),
        setUser: (user: string) => set({ user }),
      }),
      {
        name: 'dashboard-params',
        storage: createJSONStorage(() => localStorage),
      }
    )
  )
)
