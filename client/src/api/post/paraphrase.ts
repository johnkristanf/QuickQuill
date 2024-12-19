import { Paraphrase } from "@/types/paraphrase";
import axiosInstance from "../axios";

export const paraphraseText = async (data: Paraphrase) => {
    console.log("data in paraphrase: ", data)

    const response = await axiosInstance.post('/api/text/paraphrase', data); 
    return response.data; 
}
