import { create } from 'zustand'
import { devtools, persist, createJSONStorage } from 'zustand/middleware'

export const useUserStore = create<UserStore>()(
  devtools(
    persist(
      (set) => ({
        user: '',
        _hasHydrated: false,
        setUser: (user: string) => set({ user }),
        setHasHydrated: (hasHydrated: boolean) => set({ _hasHydrated: hasHydrated }),
      }),
      {
        name: 'user-store',
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: (state) => {
          return () => state.setHasHydrated(true)
        },
      }
    )
  )
)

/**
 * The type of our user global state.
 */
export type UserStore = {
  /** The current user's identifier. */
  user: string
  /** Indicates whether the state has been hydrated from storage. */
  _hasHydrated: boolean
  /** Function to set the current user. */
  setUser: (user: string) => void
  /** Function to set the hydration status. */
  setHasHydrated: (hasHydrated: boolean) => void
}
