import axios, { AxiosError } from "axios";
import store from "./redux/store";
import { logout } from "./redux/reducers/auth";

const adminApiClient = axios.create({
  baseURL: "/api/admin",
  headers: {
    "Content-Type": "application/json",
  },
});

adminApiClient.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("adminAccessToken");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

adminApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("adminRefreshToken");
        if (!refreshToken) return store.dispatch(logout({ role: "admin" }));
        const response = await axios.post("/api/auth/refresh", {
          token: refreshToken,
        });
        const newAccessToken = response.data.tokens.accessToken;
        const newRefreshToken = response.data.tokens.refreshToken;
        localStorage.setItem("adminAccessToken", newAccessToken);
        localStorage.setItem("adminRefreshToken", newRefreshToken);
        adminApiClient.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return adminApiClient(originalRequest);
      } catch (responseError: any) {
        if (
          responseError.response?.data?.message === "Refresh token is required."
        ) {
          store.dispatch(logout({ role: "admin" }));
          return Promise.reject(
            new AxiosError(
              "Your session session has been expired",
              responseError.status
            )
          );
        }
        return Promise.reject(responseError);
      }
    }
    return Promise.reject(error);
  }
);

export default adminApiClient;
