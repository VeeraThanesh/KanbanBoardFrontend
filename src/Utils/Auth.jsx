export const getAuth = () => ({
  token: localStorage.getItem("token"),
  role: localStorage.getItem("role"),
});
