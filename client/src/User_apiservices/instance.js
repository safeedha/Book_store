import axios from "axios";

const instance = axios.create({
  baseURL: 'http://localhost:8000/',
  withCredentials: true, // Sends cookies with requests
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
    console.log("what an error")
    console.log("error here",error)
    return Promise.reject(error); 
  }
);

export default instance;
