import { Document } from "@/types/document";
import apiInstance from "../axios";

export const saveDocument = async (data: Document) => {

    const response = await apiInstance.post('/save/document', data); 
    
    return response.data; 
}
