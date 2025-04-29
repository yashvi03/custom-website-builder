import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://127.0.0.1:8000/",
  baseURL:'https://custom-website-builder.onrender.com/',
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const access_token = localStorage.getItem("access_token");
    if (access_token) {
      config.headers["Authorization"] = `Bearer ${access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      showAlert("Unauthorized! Redirecting to login...");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

let showAlert = () => {};

export const setShowAlert = (func) => {
  showAlert = func;
};

export default axiosInstance;
