import api from "./api";

/**
 * Tạo một booking mới
 * @param {Object} data - Dữ liệu đặt vé
 * @param {number} data.trainId - ID của chuyến tàu
 * @param {string} data.journeyDate - Ngày đi (YYYY-MM-DD)
 * @param {Array} data.passengers - Danh sách hành khách [{name, age, gender}]
 * @param {number} data.totalFare - Tổng tiền
 * @returns {Promise} - Response từ API (chứa PNR)
 */
export const createBooking = (data) => {
  return api.post("/bookings", data);
};

/**
 * Lấy danh sách booking của user hiện tại
 * @returns {Promise}
 */
export const getMyBookings = () => {
  return api.get("/bookings/my-bookings");
};

/**
 * Lấy chi tiết một booking theo PNR
 * @param {string} pnr - Mã PNR
 * @returns {Promise}
 */
export const getBookingByPNR = (pnr) => {
  return api.get(`/bookings/${pnr}`);
};

/**
 * Hủy một booking
 * @param {string} pnr - Mã PNR cần hủy
 * @returns {Promise}
 */
export const cancelBooking = (pnr) => {
  return api.post(`/bookings/cancel/${pnr}`);
};
