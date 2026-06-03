import axios from 'axios';

const Api = axios.create({
  baseURL: 'https://cart-square.onrender.com/api',
  withCredentials: true, 
});

// Response interceptor
Api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await Api.post("/auth/refresh-token"); 
        return Api(originalRequest); 
      } catch (refreshError) {
        
        window.dispatchEvent(new Event("force-logout"));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default Api;