
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