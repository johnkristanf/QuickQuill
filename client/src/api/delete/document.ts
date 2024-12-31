import { DocumentData } from "@/types/document";
import apiInstance from "../axios";

export const deleteDocument = async (data: DocumentData) => {

    const response = await apiInstance.delete(`/delete/document/${data.id}/${encodeURIComponent(data.document_name)}`); 
    return response.data; 
}
