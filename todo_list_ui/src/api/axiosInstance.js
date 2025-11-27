import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001",
  timeout: 10000,
});

//토큰 가져오기
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export default api;