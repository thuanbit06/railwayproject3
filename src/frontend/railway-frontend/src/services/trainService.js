import api from "./api";

export const searchTrains = (params) => {
  return api.get("/trains/search", { params });
};

export const getTrainById = (id) => {
  return api.get(`/trains/${id}`);
};

/** ✅ DÙNG CÁI NÀY */
export const getAllTrains = () => {
  return api.get("/trains");
};

export const createTrain = (data) => {
  return api.post("/trains", data);
};

export const updateTrain = (id, data) => {
  return api.put(`/trains/${id}`, data);
};

export const deleteTrain = (id) => {
  return api.delete(`/trains/${id}`);
};
