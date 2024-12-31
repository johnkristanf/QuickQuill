import { webInstance } from "../axios";

export const signOutUser = async () => {
    const response = await webInstance.post('/signout/user', {}); 
    return response.data; 
}
