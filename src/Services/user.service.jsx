import axiosHttp from "./Interceptor";

const postUser = (data) => {
  console.log(axiosHttp, "AH");
  return axiosHttp.post("/createUser", data);
};

const getUser = (data) => {
  return axiosHttp.get("/getUser", data);
};

const updateUser = (id, data) => {
  return axiosHttp.put(`/updateUser/${id}`, data);
};

const deleteUser = (id, data) => {
  return axiosHttp.delete(`/deleteUser/${id}`, data);
};

export { postUser, getUser, updateUser, deleteUser };
