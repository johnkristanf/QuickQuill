import apiInstance from "../axios";

export const getCsrfToken = async () => {
    try {
      // Make a GET request to fetch the CSRF token from the sanctum cookie
      await apiInstance.get('/sanctum/csrf-cookie');
      console.log('CSRF token set successfully');
    } catch (error) {
      console.error('Error setting CSRF token:', error);
    }
};