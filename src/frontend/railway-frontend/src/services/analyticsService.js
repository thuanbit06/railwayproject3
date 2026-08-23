import api from "../services/api";

const analyticsService = {
  getAnalytics: async (range = "Month") => {
    const response = await api.get(`/analytics?range=${range}`);
    return response.data;
  },
};

export default analyticsService;
