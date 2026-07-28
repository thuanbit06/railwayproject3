import { apiClient } from "./apiClient";

export const authService = {
  login: (username, password) =>
    apiClient.post("/auth/login", { username, password }),
  getMe: () => apiClient.get("/auth/me"),
  changePassword: (oldPwd, newPwd) =>
    apiClient.put("/auth/change-password", {
      oldPassword: oldPwd,
      newPassword: newPwd,
    }),
};
