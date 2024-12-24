import apiInstance from "../axios";

export const signOutUser = async () => {
    const response = await apiInstance.post('/signout/user', {}); 
    return response.data; 
}
