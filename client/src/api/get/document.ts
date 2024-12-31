import apiInstance from "../axios";

export const getSavedDocuments = async () => {
    const response = await apiInstance.get('/saved/documents'); 
    return response.data; 
}


export const getSavedDocumentContents = async (documentName: string) => {
    const response = await apiInstance.get(`/documents/content/${documentName}`); 
    return response.data; 
}
