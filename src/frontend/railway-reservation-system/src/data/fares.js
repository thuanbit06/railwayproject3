export const fareRules = [
  {
    minDistance: 0,
    maxDistance: 500,
    AC1: 1500,
    AC2: 900,
    AC3: 600,
    Sleeper: 250,
    General: 100,
  },
  {
    minDistance: 501,
    maxDistance: 1000,
    AC1: 2800,
    AC2: 1700,
    AC3: 1100,
    Sleeper: 450,
    General: 180,
  },
  {
    minDistance: 1001,
    maxDistance: 9999,
    AC1: 5000,
    AC2: 3000,
    AC3: 2000,
    Sleeper: 800,
    General: 300,
  },
];

export const calculateFare = (distance, coachClass) => {
  const rule = fareRules.find(
    (r) => distance >= r.minDistance && distance <= r.maxDistance,
  );
  return rule ? rule[coachClass] : 0;
};
