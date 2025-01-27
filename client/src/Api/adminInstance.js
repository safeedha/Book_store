import axios from "axios";

const adminInstance = axios.create({
  baseURL: "http://localhost:8000/admin", 
  withCredentials: true,
});

export default adminInstance;
