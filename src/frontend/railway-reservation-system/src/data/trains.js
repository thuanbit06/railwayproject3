// frontend/src/data/trains.js

export const trains = [
  {
    trainNo: "12345",
    trainName: "Rajdhani Express",
    upDownStatus: "UP",
    routeId: "RT001",
    coaches: { AC1: 2, AC2: 4, AC3: 6, Sleeper: 10, General: 5 },
    scheduleDays: ["Mon", "Wed", "Fri", "Sun"],
    schedule: [
      { stationCode: "NDLS", arrival: "-", departure: "16:00", distance: 0 },
      { stationCode: "BCT", arrival: "09:00", departure: "-", distance: 1500 },
    ],
  },
  {
    trainNo: "22346",
    trainName: "Duronto Express",
    upDownStatus: "DOWN",
    routeId: "RT002",
    coaches: { AC1: 1, AC2: 3, AC3: 5, Sleeper: 8, General: 4 },
    scheduleDays: ["Tue", "Thu", "Sat"],
    schedule: [
      { stationCode: "HWH", arrival: "-", departure: "20:00", distance: 0 },
      { stationCode: "MAS", arrival: "10:30", departure: "-", distance: 1800 },
    ],
  },
  {
    trainNo: "12627",
    trainName: "Karnataka Express",
    upDownStatus: "UP",
    routeId: "RT003",
    coaches: { AC1: 1, AC2: 2, AC3: 4, Sleeper: 12, General: 6 },
    scheduleDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    schedule: [
      { stationCode: "NDLS", arrival: "-", departure: "20:50", distance: 0 },
      { stationCode: "SBC", arrival: "08:40", departure: "-", distance: 2200 },
    ],
  },
];

export const getTrainByNo = (trainNo) =>
  trains.find((t) => t.trainNo === trainNo);
