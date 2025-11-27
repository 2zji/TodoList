import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001",
  timeout: 10000,
});

//토큰 가져오기
api.interceptors.request.use((config) => {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkb2dAZS1taXJpbS5rciIsImV4cCI6MTc2NDM0MjY2OX0.BNLzF04ydp2FiFcDnsuzI3zeZLKHeRe_FiAr9_x4XlY";

  if(token){
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
})

export default api;