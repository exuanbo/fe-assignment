import create from 'zustand'

export enum ViewOption {
  All,
  NotCompleted,
  Completed,
}

export enum Appearance {
  System = 'system',
  Dark = 'dark',
  Light = 'light'
}

interface RootState {
  viewOption: ViewOption
  setViewOption: (viewOption: ViewOption) => void
  appearance: Appearance
  setAppearance: (appearance: Appearance) => void
}

export const useStore = create<RootState>(set => ({
  viewOption: ViewOption.All,
  setViewOption: (viewOption: ViewOption) => {
    set(() => ({ viewOption }))
  },
  appearance: Appearance.System,
  setAppearance: (appearance: Appearance) => {
    set(() => ({ appearance }))
  }
}))
