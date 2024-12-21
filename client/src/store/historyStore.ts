import { create } from "zustand";

interface HistoryState{
    original_text: string,
    transformed_text: string,
    updateHistoryState: (original_text: string, transformed_text: string) => void
}

export const useHistoryStore = create<HistoryState>((set) => ({
    original_text: "",
    transformed_text: "",
    updateHistoryState: (original_text, transformed_text) => set({ original_text, transformed_text })
}))