import api from "./api";

// export const getTripSeats = async (tripId) => {
//   const response = await api.get(`/trips/${tripId}/seats`);

//   return response.data;
// };

const tripService = {
  getTripSeats: async (tripId) => {
    const response = await api.get(`/trips/${tripId}/seats`);

    return response.data;
  },

  // Lấy danh sách trip (hỗ trợ search + filter + phân trang)
  getTrips: async (params = {}) => {
    const response = await api.get(`trips`, { params });
    return response.data; // kỳ vọng: { data: [], total: number } hoặc { items: [], totalCount: number }
  },

  // Lấy chi tiết 1 trip
  getTripById: async (id) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  // Tạo trip mới
  createTrip: async (data) => {
    const response = await api.post(`/trips`, data);
    return response.data;
  },

  // Cập nhật trip
  updateTrip: async (id, data) => {
    const response = await api.put(`/trips/${id}`, data);
    return response.data;
  },

  // Xóa trip
  deleteTrip: async (id) => {
    const response = await api.delete(`/trips/${id}`);
    return response.data;
  },

  // Lấy danh sách trip theo ngày + ga đi + ga đến (dùng cho trang tìm kiếm của user)
  searchTrips: async ({ fromStationId, toStationId, journeyDate }) => {
    const response = await api.get(`/trips/search`, {
      params: { fromStationId, toStationId, journeyDate },
    });
    return response.data;
  },
};

export default tripService;
