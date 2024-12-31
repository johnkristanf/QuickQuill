import { Paraphrase } from "@/types/document";
import apiInstance from "../axios";

export const paraphraseText = async (data: Paraphrase) => {
    console.log("data in paraphrase: ", data)

    const response = await apiInstance.post('/text/paraphrase', data); 
    return response.data; 
}
