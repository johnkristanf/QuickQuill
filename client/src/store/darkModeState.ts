import { create } from "zustand"


interface DarkModeState{
    isDarkMode: boolean,
    setIsDarkModeState: (isDarkMode: boolean) => void
}

export const useDarkModeStore = create<DarkModeState>((set) => ({
    isDarkMode: false,
    setIsDarkModeState: (isDarkMode: boolean) => set({isDarkMode})
}))