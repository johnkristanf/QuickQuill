import { DocumentRename } from "@/types/document";
import apiInstance from "../axios";

export const renameDocument = async (data: DocumentRename) => {
    const { id, document_name, old_document_name } = data;

    console.log("id: ", id);
    console.log("document_name: ", document_name);
    console.log("old_document_name: ", old_document_name);
    

    const response = await apiInstance.put(`/rename/document/${id}`, {document_name, old_document_name}); 
    
    return response.data; 
}
