import api from "./api";

export const getStations = () => api.get("/admin/stations");
export const createStation = (data) => api.post("/admin/stations", data);
export const updateStation = (id, data) =>
  api.put(`/admin/stations/${id}`, data);
export const deleteStation = (id) => api.delete(`/admin/stations/${id}`);
