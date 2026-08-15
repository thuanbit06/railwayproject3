import api from "./api";

export const getFareRules = () => api.get("/admin/fare-rules");
export const createFareRule = (data) => api.post("/admin/fare-rules", data);
export const updateFareRule = (id, data) =>
  api.put(`/admin/fare-rules/${id}`, data);
export const deleteFareRule = (id) => api.delete(`/admin/fare-rules/${id}`);
