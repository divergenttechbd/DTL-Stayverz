import { create } from 'zustand'

interface AppStore {
  extendedNavbar: boolean
  fullScreenSearch: boolean
}

export const useAppStore = create<AppStore>((set, get) => ({
  extendedNavbar: false,
  fullScreenSearch: false
}))
