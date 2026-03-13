import axios from "axios";

const api = axios.create({
  baseURL: "http://berce-backend.vercel.app/api/v1",
  withCredentials: true,
});

export default api;
