import axios from "axios";

const apiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
    withCredentials: true,
});

// 공개 API용 클라이언트 (인증이 필요 없는 요청)
export const publicApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000/api",
    withCredentials: false,
});

export default apiClient;
