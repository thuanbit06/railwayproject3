// src/utils/calculateFare.js
import { fareRules, reservationFees } from "../data";

export const calculateFare = (distance, coachClass, totalPassengers = 1) => {
  const rule = fareRules.find(
    (r) => distance >= r.minDistance && distance <= r.maxDistance,
  );
  if (!rule) return 0;

  const baseFare = rule[coachClass] || 0;
  const totalBase = baseFare * totalPassengers;
  const extraFees =
    reservationFees.reservationFee + reservationFees.superfastFee;

  return totalBase + extraFees;
};

export const calculateCancellationFee = (journeyDate, fare) => {
  const today = new Date();
  const journey = new Date(journeyDate);
  const diffTime = journey - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { fee: 0, refund: 0, valid: false };
  if (diffDays === 0) return { fee: fare, refund: 0, valid: false }; // Không cho hủy trong ngày đi

  if (diffDays <= 3)
    return {
      fee: Math.round(fare * 0.25),
      refund: Math.round(fare * 0.75),
      valid: true,
    };
  if (diffDays <= 7)
    return {
      fee: Math.round(fare * 0.1),
      refund: Math.round(fare * 0.9),
      valid: true,
    };
  return {
    fee: Math.round(fare * 0.05),
    refund: Math.round(fare * 0.95),
    valid: true,
  };
};
