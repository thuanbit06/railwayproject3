import api from "./api";

export const getAdminTrains = () => {
  return api.get("/admin/trains");
};

export const searchAdminTrains = (params) => {
  return api.get("/admin/trains/search", {
    params,
  });
};

export const getAdminTrainById = (id) => {
  return api.get(`/admin/trains/${id}`);
};

export const createAdminTrain = (data) => {
  return api.post("/admin/trains", data);
};

export const updateAdminTrain = (id, data) => {
  return api.put(`/admin/trains/${id}`, data);
};

export const deleteAdminTrain = (id) => {
  return api.delete(`/admin/trains/${id}`);
};

export const updateAdminTrainStatus = (id, isActive) => {
  return api.patch(`/admin/trains/${id}/status`, isActive);
};
