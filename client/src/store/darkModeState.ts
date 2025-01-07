import { create } from "zustand"


interface DarkModeState{
    isDarkMode: boolean,
    updateThemeState: () => void
}

export const useDarkModeStore = create<DarkModeState>((set) => ({
    isDarkMode: localStorage.getItem('theme') === 'dark',
    updateThemeState: () => {
        set((state) => {
            const newState = !state.isDarkMode; 
            const htmlElement = document.documentElement;

            const theme = newState ? 'dark' : 'light';

            htmlElement.classList.toggle('dark', newState);
            localStorage.setItem('theme', theme);


            localStorage.setItem('theme', newState ? 'dark' : 'light');
            return { isDarkMode: newState };
        });
    },
}))