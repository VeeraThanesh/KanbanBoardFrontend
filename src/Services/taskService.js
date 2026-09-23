import axiosHttp from "./Interceptor";

// Helper to get token (adjust based on how you store it, e.g., localStorage)
const getAuthHeader = () => {
  const token = localStorage.getItem("token"); // Assuming 'token' key
  return { headers: { Authorization: `Bearer ${token}` } };
};

const createTask = (data) => {
  return axiosHttp.post("/task", data);
};

const getTask = (params = {}) => {
  return axiosHttp.get("/tasks", {
    params,
  });
};

const updateTask = (id, data) => {
  return axiosHttp.put(`/task/${id}`, data);
};

const deleteTask = (id, data) => {
  return axiosHttp.delete(`/task/${id}`, data);
};

const getTaskById = (id) => {
  return axiosHttp.get(`/task/${id}`);
};

export { createTask, getTask, updateTask, deleteTask, getTaskById };

// export const createTask = async (taskData) => {
//   const response = await axios.post(
//     `${API_URL}/tasks`,
//     taskData,
//     getAuthHeader()
//   );
//   return response.data;
// };

// export const getTasks = async (projectId) => {
//   const params = projectId ? { projectId } : {};
//   const response = await axios.get(`${API_URL}/tasks`, {
//     ...getAuthHeader(),
//     params,
//   });
//   return response.data;
// };

// export const updateTask = async (id, taskData) => {
//   const response = await axios.put(
//     `${API_URL}/tasks/${id}`,
//     taskData,
//     getAuthHeader()
//   );
//   return response.data;
// };

// export const updateTaskStatus = async (id, status, order) => {
//   const response = await axios.put(
//     `${API_URL}/tasks/${id}/status`,
//     { status, order },
//     getAuthHeader()
//   );
//   return response.data;
// };

// export const deleteTask = async (id) => {
//   const response = await axios.delete(
//     `${API_URL}/tasks/${id}`,
//     getAuthHeader()
//   );
//   return response.data;
// };

// export const getHistory = async (entityType, entityId) => {
//   const params = { entityType, entityId };
//   const response = await axios.get(`${API_URL}/history`, {
//     ...getAuthHeader(),
//     params,
//   });
//   return response.data;
// };
