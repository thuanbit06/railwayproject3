import { apiClient } from "./apiClient";

export const trainService = {
  getStations: () => apiClient.get("/trains/stations"),

  searchTrains: (params) =>
    apiClient.get(
      `/trains/search?${new URLSearchParams({
        from: params.from,
        to: params.to,
        date: params.date,
        coachClass: params.coachClass,
      })}`,
    ),

  getTrainByNo: (trainNo) => apiClient.get(`/trains/${trainNo}`),
};
