import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIState {
  theme: 'dark' | 'light'
  toggleTheme: () => void
  commandPaletteOpen: boolean
  setCommandPaletteOpen: (v: boolean) => void
  expertDetail: boolean
  setExpertDetail: (v: boolean) => void
  perspective: 'business' | 'ba-bsa' | 'developer' | 'qa' | 'operations'
  setPerspective: (p: UIState['perspective']) => void
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      toggleTheme: () => set({ theme: get().theme === 'dark' ? 'light' : 'dark' }),
      commandPaletteOpen: false,
      setCommandPaletteOpen: (v) => set({ commandPaletteOpen: v }),
      expertDetail: true,
      setExpertDetail: (v) => set({ expertDetail: v }),
      perspective: 'business',
      setPerspective: (p) => set({ perspective: p }),
    }),
    { name: 'payment-lab-ui' },
  ),
)
