import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_PORT,
  withCredentials: true,
});

instance.interceptors.request.use(
  (request) => {
    console.log(request);
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log('what an error');
    console.log('error here', error);
    return Promise.reject(error);
  }
);

export default instance;
