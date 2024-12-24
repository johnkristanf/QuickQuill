import apiInstance from "../axios";

export const getParaphrasingHistory = async () => {
    const response = await apiInstance.get('/api/paraphrasing/history'); 
    return response.data; 
}
