/* eslint-disable @typescript-eslint/no-explicit-any */

export type Paraphrase = {
    original_text: string,
    paraphrase_mode: string,
}


export type History = {
    id: number,
    original_text: string, 
    transformed_text: string, 
    created_at: string
}

export type Document = {
    document_name: string, 
    document_content: any
}

export type SavedDocuments = {
    id: number,
    name: string,
    user_id: number,
    created_at: string
}


export type DocumentData = {
    id: number, 
    document_name: string
    old_document_name?: string
}
