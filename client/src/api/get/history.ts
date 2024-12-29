import apiInstance from "../axios";

export const getParaphrasingHistory = async () => {
    const response = await apiInstance.get('/paraphrasing/history'); 
    return response.data; 
}
