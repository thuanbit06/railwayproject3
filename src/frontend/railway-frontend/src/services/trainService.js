import api from "./api";

// =========================================================
// TRAIN SCHEDULE SEARCH & LIST
// =========================================================

export const searchTrains = (params) => {
  return api.get("/trains/search", { params });
};

export const getAllTrains = () => {
  return api.get("/trains");
};

export const getTrainById = (id) => {
  return api.get(`/trains/${id}`);
};

// =========================================================
// SCHEDULE DETAIL (Cho trang TrainScheduleDetail)
// =========================================================

/**
 * Lấy chi tiết 1 lịch trình: thông tin tàu + operating days + danh sách trạm dừng
 * GET /api/schedules/{scheduleId}/detail
 */
export const getScheduleDetail = (scheduleId) => {
  return api.get(`/api/schedules/${scheduleId}/detail`);
};

/**
 * Lấy danh sách trạm dừng của 1 lịch trình
 * GET /api/schedules/{scheduleId}/stops
 */
export const getScheduleStops = (scheduleId) => {
  return api.get(`/api/schedules/${scheduleId}/stops`);
};

// =========================================================
// CRUD TRAINS (Admin)
// =========================================================

export const createTrain = (data) => {
  return api.post("/trains", data);
};

export const updateTrain = (id, data) => {
  return api.put(`/trains/${id}`, data);
};

export const deleteTrain = (id) => {
  return api.delete(`/trains/${id}`);
};
