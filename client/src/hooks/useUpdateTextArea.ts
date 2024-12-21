import { useHistoryStore } from "@/store/historyStore"
import { Paraphrase } from "@/types/paraphrase"
import { useEffect } from "react"
import { UseFormSetValue } from "react-hook-form"

export const useUpdateTextArea = (setValue: UseFormSetValue<Paraphrase>, setParaphrasedText: React.Dispatch<React.SetStateAction<string>>) => {
    const originalTextCurrState = useHistoryStore((state) => state.original_text)
    const transformedTextCurrState = useHistoryStore((state) => state.transformed_text)

    useEffect(() => {
        if(originalTextCurrState){
            setValue('original_text', originalTextCurrState)
        }
    
        if(transformedTextCurrState){
            setParaphrasedText(transformedTextCurrState)
        }
    
    }, [originalTextCurrState, transformedTextCurrState, setValue, setParaphrasedText])
}