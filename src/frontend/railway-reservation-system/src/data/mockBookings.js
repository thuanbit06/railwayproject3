let bookings = [
  {
    pnr: "PNR12345678",
    passenger_name: "Test User",
    date_of_travel: "2026-08-15",
    train_no: "12345",
    coach_class: "AC3",
    seat_no: "B4",
    fare: 2030,
    cancelled: false,
  },
];

export const getMockBookings = () => bookings;
export const getMockBookingByPNR = (pnr) => bookings.find((b) => b.pnr === pnr);
