import axiosInstance from "../axios";


export const getUserData = async () => {
    const response = await axiosInstance.get('/api/user/data'); 
    return response.data; 
}
