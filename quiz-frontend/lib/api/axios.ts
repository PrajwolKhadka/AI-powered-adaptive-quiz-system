import axios from "axios";
import { getAuthToken } from "@/lib/cookies";
export const API_URL =
  process.env.NEXT_PUBLIC_API_URL 
  || "http://localhost:5000";

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  // headers: {
  //   "Content-Type": "application/json",
  // },
});
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken(); 
    console.log("Token:", await getAuthToken());
// Retrieve your token
    console.log("Axios Interceptor - Retrieved Token:", token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;


// import axios from "axios";

// export const API_URL =
//   process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// const axiosInstance = axios.create({
//   baseURL: API_URL,
//   // withCredentials: true, // ✅ THIS IS KEY
// });

// axiosInstance.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response?.status === 401) {
//       window.location.href = "/login";
//     }
//     return Promise.reject(err);
//   }
// );

// export default axiosInstance;
