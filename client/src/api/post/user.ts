import axiosInstance from "../axios";

export const signOutUser = async () => {
    const response = await axiosInstance.post('/signout/user', {}); 
    return response.data; 
}
