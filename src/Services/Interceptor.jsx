// // service.js
// import axios from "axios";
// import { toast } from "react-toastify";

// const axiosHttp = axios.create({
//   baseURL: process.env.REACT_APP_BACKEND_LOCAL_BASE_URL,
// });

// // Interceptor for response errors
// axiosHttp.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     // Handle network errors or server errors
//     const message =
//       error.response?.data?.message || error.message || "Something went wrong!";

//     toast.error(message, {
//       position: "top-right",
//       autoClose: 3000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       theme: "colored",
//     });

//     return Promise.reject(error);
//   }
// );

// export default axiosHttp;

// // service.js
// import axios from "axios";
// import { toast } from "react-toastify";

// // Create Axios instance
// const axiosHttp = axios.create({
//   baseURL: process.env.REACT_APP_BACKEND_LOCAL_BASE_URL,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Request interceptor (optional, e.g., for auth headers)
// axiosHttp.interceptors.request.use(
//   (config) => {
//     // You can add auth token here if needed
//     // const token = localStorage.getItem("token");
//     // if (token) config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => {
//     // Handle request errors
//     toast.error("Request error: " + error.message, {
//       position: "top-right",
//       autoClose: 3000,
//       theme: "colored",
//     });
//     return Promise.reject(error);
//   }
// );

// // Response interceptor
// axiosHttp.interceptors.response.use(
//   (response) => {
//     // If you want, you can show a success toast for 2xx responses
//     // toast.success(response.data.message || "Success!", { autoClose: 2000 });
//     return response;
//   },
//   (error) => {
//     // Handle response errors
//     const message =
//       error.response?.data?.message || error.message || "Something went wrong!";
//     const status = error.response?.status;

//     // Optional: handle specific status codes differently
//     if (status === 409) {
//       toast.warning(message, {
//         position: "top-right",
//         autoClose: 3000,
//         theme: "colored",
//       });
//     } else {
//       toast.error(message, {
//         position: "top-right",
//         autoClose: 3000,
//         theme: "colored",
//       });
//     }

//     return Promise.reject(error); // propagate error to the caller
//   }
// );

// export default axiosHttp;

// service.js
import axios from "axios";
import { toast } from "react-toastify";

const axiosHttp = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_LOCAL_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosHttp.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    toast.error("Request error: " + error.message, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });
    return Promise.reject(error);
  }
);

// Response interceptor
// axiosHttp.interceptors.response.use(
//   // (response) => response,
//   (response) => {
//     // Automatically unwrap backend response
//     // So frontend can directly use response.data as the payload
//     if (
//       response?.data &&
//       response.data.error === false &&
//       response.data.data !== undefined
//     ) {
//       return { ...response.data, data: response.data.data }; // keep totalCount, message, error
//     }
//     return response.data || response; // fallback
//   },
//   (error) => {
//     // If server sent a message, replace Axios' default error message
//     if (error.response?.data?.message) {
//       error.message = error.response.data.message;
//     }

//     toast.error(error.message, {
//       position: "top-right",
//       autoClose: 3000,
//       theme: "colored",
//     });

//     return Promise.reject(error);
//   }
// );

axiosHttp.interceptors.response.use(
  (response) => {
    if (
      response?.data &&
      response.data.error === false &&
      response.data.data !== undefined
    ) {
      return { ...response.data, data: response.data.data };
    }
    return response.data || response;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // Clear token
      localStorage.removeItem("token");

      localStorage.clear();
      // Redirect to login
      window.location.href = "/";
      return Promise.reject(error);
    }

    if (error.response?.data?.message) {
      error.message = error.response.data.message;
    }

    toast.error(error.message, {
      position: "top-right",
      autoClose: 3000,
      theme: "colored",
    });

    return Promise.reject(error);
  }
);

export default axiosHttp;
