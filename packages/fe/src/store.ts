import create from 'zustand'

export enum Appearance {
  System = 'system',
  Dark = 'dark',
  Light = 'light'
}

interface RootState {
  appearance: Appearance
  setAppearance: (appearance: Appearance) => void
}

export const useStore = create<RootState>(set => ({
  appearance: Appearance.System,
  setAppearance: (appearance: Appearance) => {
    set(() => ({ appearance }))
  }
}))
