// frontend/src/lib/validators.js

export const validateJourneyDate = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const journeyDate = new Date(date);
  const maxDate = new Date();
  maxDate.setDate(maxDate.getDate() + 90);

  if (journeyDate < today) {
    return { valid: false, message: "Journey date must be in future" };
  }
  if (journeyDate > maxDate) {
    return { valid: false, message: "Journey date cannot exceed 90 days" };
  }
  return { valid: true };
};

export const validateStationPair = (from, to) => {
  if (!from) return { valid: false, message: "Please select source station" };
  if (!to)
    return { valid: false, message: "Please select destination station" };
  if (from === to)
    return { valid: false, message: "Source and destination cannot be same" };
  return { valid: true };
};

export const validatePassword = (password) => {
  if (password.length < 8) {
    return { valid: false, message: "Password must be at least 8 characters" };
  }
  if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
    return { valid: false, message: "Password must be alphanumeric" };
  }
  return { valid: true };
};
