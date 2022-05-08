import create from 'zustand'

export enum ViewOption {
  All,
  NotCompleted,
  Completed,
}

interface RootState {
  viewOption: ViewOption
  setViewOption: (viewOption: ViewOption) => void
}

export const useStore = create<RootState>(set => ({
  viewOption: ViewOption.All,
  setViewOption: (viewOption: ViewOption) => {
    set(state => ({ ...state, viewOption }))
  }
}))
