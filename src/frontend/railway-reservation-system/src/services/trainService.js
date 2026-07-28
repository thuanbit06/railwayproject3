import { apiClient } from "./apiClient";

export const trainService = {
  getStations: () => apiClient.get("/trains/stations"),
  searchTrains: (params) =>
    apiClient.get(`/trains/search?${new URLSearchParams(params)}`),
  getAllTrains: () => apiClient.get("/trains"),
};
