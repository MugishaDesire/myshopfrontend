import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // required for your session-cookie auth (Google OAuth)
});

// Central handler for rate-limit responses so every component
// gets a consistent, readable message instead of a raw 429.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 429) {
      const resetSeconds = error.response.headers["ratelimit-reset"];
      const backendMessage = error.response.data?.error;

      error.userMessage = resetSeconds
        ? `${backendMessage || "Too many requests."} Try again in ${resetSeconds}s.`
        : backendMessage || "Too many requests. Please slow down.";
    }
    return Promise.reject(error);
  }
);

export default api;