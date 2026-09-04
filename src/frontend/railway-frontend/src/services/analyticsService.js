import api from "./api";

const analyticsService = {
  getAnalytics: async (range = "Month") => {
    try {
      const response = await api.get(
        `/admin/analytics?range=${encodeURIComponent(range)}`,
      );

      return response.data;
    } catch (error) {
      console.error(
        "Failed to fetch analytics:",
        error.response?.data || error.message,
      );

      throw error;
    }
  },
};

export default analyticsService;
