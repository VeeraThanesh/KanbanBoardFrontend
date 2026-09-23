import axiosHttp from "./Interceptor";

const API_URL = "http://localhost:3000/";

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

const createProject = (data) => {
  return axiosHttp.post("/projects", data);
};

const getProjects = ({ search, sort, page, limit } = {}) => {
  return axiosHttp.get("/projects", { params: { search, sort, page, limit } });
};

const updateProject = (id, data) => {
  return axiosHttp.put(`/projects/${id}`, data);
};

const deleteProject = (id, data) => {
  return axiosHttp.delete(`/projects/${id}`, data);
};

export { createProject, getProjects, updateProject, deleteProject };
