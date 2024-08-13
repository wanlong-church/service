import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

import { DashboardMode, DashboardState, SheetStatus } from '@/app/type'

export const useStore = create<DashboardState>()(
  devtools(
    persist(
      (set, get) => ({
        mode: 'all',
        user: '',
        sheetStatus: { data: [], url: '' },
        _hasHydrated: false,
        setMode: (mode: DashboardMode) => set({ mode }),
        setUser: (user: string) => set({ user }),
        setSheetStatus: (sheetStatus: Partial<SheetStatus>) => {
          set({ sheetStatus: { ...get().sheetStatus, ...sheetStatus } })
        },
        setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),
      }),
      {
        name: 'dashboard-params',
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: (state) => {
          return () => state.setHasHydrated(true)
        },
      }
    )
  )
)
