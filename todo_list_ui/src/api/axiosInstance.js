import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8001",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//토큰 가져오기
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // 비동기 작업 실패 시, error 표시
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
