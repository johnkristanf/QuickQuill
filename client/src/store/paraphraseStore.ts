import { create } from "zustand";

interface ParaphraseTextState{
    paraphrasedText: string,
    updateParaphrasedTextState: (paraphrasedText: string) => void
}

export const useParaphraseStore = create<ParaphraseTextState>((set) => ({
    paraphrasedText: "",
    updateParaphrasedTextState: (paraphrasedText) => set({ paraphrasedText })
}))