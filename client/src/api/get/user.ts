import apiInstance from "../axios";


export const getUserData = async () => {
    const response = await apiInstance.get('/api/user/data'); 
    return response.data; 
}
