import axiosInstance from "../axios";

export const getParaphrasingHistory = async () => {
    const response = await axiosInstance.get('/api/paraphrasing/history'); 
    return response.data; 
}
