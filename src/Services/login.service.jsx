import axiosHttp from "./Interceptor";

const loginAuth = (data) => {
  console.log(data, "DATA");
  return axiosHttp.post("/login", data);
};

export { loginAuth };
