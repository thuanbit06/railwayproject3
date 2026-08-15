import api from "./api";

/**
 * Cập nhật thông tin người dùng
 * @param {number} id
 * @param {Object} data
 */
export const updateProfile = (id, data) => {
  return api.put(`/users/${id}`, data);
};

/**
 * Đổi mật khẩu
 * @param {number} id
 * @param {string} currentPassword
 * @param {string} newPassword
 */
export const changePassword = (id, currentPassword, newPassword) => {
  return api.post(`/users/${id}/change-password`, {
    currentPassword,
    newPassword,
  });
};

/**
 * Lấy danh sách người dùng (Admin)
 */
export const getUsers = () => {
  return api.get("/users");
};

/**
 * Lấy thông tin 1 người dùng
 */
export const getUserById = (id) => {
  return api.get(`/users/${id}`);
};
