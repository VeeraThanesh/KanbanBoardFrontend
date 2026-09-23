import axiosHttp from "./Interceptor";

const getHistory = ({ search, entityType, entityId } = {}) => {
  return axiosHttp.get("/history", {
    params: { search, entityType, entityId },
  });
};

export { getHistory };
