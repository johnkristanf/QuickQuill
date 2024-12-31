import { DocumentData } from "@/types/document";
import { create } from "zustand";

interface DocumentDataState{
    DocumentDialogOpen: string,
    old_document_name: string,
    data: DocumentData,
    updateDocumentState: (data: DocumentData) => void,
    setOldDocumentNameState: (old_document_name: string) => void,
    setDocumentDialogOpenState: (DocumentDialogOpen: string) => void,
}

export const useDocumentStore = create<DocumentDataState>((set) => ({
    DocumentDialogOpen: "",
    old_document_name: "",
    data: {
        id: 0,
        document_name: "",
    },
    updateDocumentState: (data) => set({ data }),
    setOldDocumentNameState: (old_document_name) => set({ old_document_name }),
    setDocumentDialogOpenState: (DocumentDialogOpen) => set({ DocumentDialogOpen }),
    
}))