import { Paraphrase } from "@/types/paraphrase";
import apiInstance from "../axios";

export const paraphraseText = async (data: Paraphrase) => {
    console.log("data in paraphrase: ", data)

    const response = await apiInstance.post('/api/text/paraphrase', data); 
    return response.data; 
}
