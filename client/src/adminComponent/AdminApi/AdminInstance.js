import axios from "axios";

const adminInstance = axios.create({
  baseURL: import.meta.env.VITE_ADMIN, 
  withCredentials: true,
});

adminInstance.interceptors.request.use(
  (config) => {
   
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminInstance.interceptors.response.use(
  (response) => {
 
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default adminInstance;
