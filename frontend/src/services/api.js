import axios from "axios";

const api = axios.create({
  baseURL: "http://berce-store.vercel.app/api/v1",
  withCredentials: true,
});

export default api;
