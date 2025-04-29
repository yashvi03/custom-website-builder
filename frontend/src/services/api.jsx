import axiosInstance from "./axiosInstance";

export const getRoles = () => axiosInstance.get("/get_roles");
export const createUser = (data) => axiosInstance.post("/register", data);
export const login = (data) => axiosInstance.post("/login", data);
export const getPermissions = (role_id) =>
  axiosInstance.get(`/get_role/${role_id}?just_per=true`);
export const getRoleById = (role_id) =>
  axiosInstance.get(`/get_role/${role_id}`);
export const updateEmp = (id, data) =>
  axiosInstance.put(`/update_emp/${id}`, data);
export const addEmp = (data) => axiosInstance.post("/employee", data);
export const updateRole = (role_id, data) =>
  axiosInstance.put(`/update_role/${role_id}`, data);
export const addRole = (data) => axiosInstance.post("/role", data);
export const getEmp = () => axiosInstance.get("/get_emp");
export const deleteEmp = (id) => axiosInstance.delete(`/delete_emp/${id}`);
export const deleteRole = (id) => axiosInstance.delete(`/delete_role/${id}`);
export const getUser = () => axiosInstance.get("/get_user");
export const getUserById = (id) => axiosInstance.get(`/get_user/${id}`);
export const updateUser = (id, data) =>
  axiosInstance.put(`/update_user/${id}`, data);
export const deleteUser = (id) => axiosInstance.delete(`/delete_user/${id}`);
export const addCareer = (data) => axiosInstance.post("/add_career", data);
export const getCareer = () => axiosInstance.get("/get_career");
export const getCareerById = (id) => axiosInstance.get(`/get_career/${id}`);
export const updateCareer = (id, data) =>
  axiosInstance.put(`/update_career/${id}`, data);
export const deleteCareer = (id) =>
  axiosInstance.delete(`/delete_career/${id}`);
// export const addHome = (data) => axiosInstance.post('/add_home',data);
export const getPage = () => axiosInstance.get("/get_page");
// export const getHomeById = (id) => axiosInstance.get(`/get_home/${id}`);
export const updatePage = (data) => axiosInstance.put(`/update_page`, data);
// export const deleteHome =(id) => axiosInstance.delete(`/delete_home/${id}`);
export const uploadImage = (data) =>
  axiosInstance.put("/upload_image?home=home", data);
