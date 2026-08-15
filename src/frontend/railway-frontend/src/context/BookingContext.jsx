import React, { createContext, useState } from "react";

export const BookingContext = createContext();

export const BookingProvider = ({ children }) => {
  const [bookingData, setBookingData] = useState({
    train: null,
    passengers: [],
    totalFare: 0,
  });

  const setTrain = (train) => {
    setBookingData((prev) => ({ ...prev, train }));
  };

  const setPassengers = (passengers) => {
    setBookingData((prev) => ({ ...prev, passengers }));
  };

  const clearBooking = () => {
    setBookingData({ train: null, passengers: [], totalFare: 0 });
  };

  return (
    <BookingContext.Provider
      value={{ bookingData, setTrain, setPassengers, clearBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => React.useContext(BookingContext);
