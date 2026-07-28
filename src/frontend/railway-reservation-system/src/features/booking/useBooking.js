// frontend/src/features/booking/useBooking.js
import { useState, useCallback } from "react";
import { bookingService } from "../../services/bookingService";
import { useAuth } from "../auth/useAuth";

export const useBooking = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const bookTicket = useCallback(async (bookingData) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.bookTicket(bookingData);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const cancelTicket = useCallback(async (pnr) => {
    setLoading(true);
    setError(null);
    try {
      const result = await bookingService.cancelTicket(pnr);
      return { success: true, data: result };
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const getDailyCash = useCallback(async (date) => {
    setLoading(true);
    try {
      const result = await bookingService.getDailyCash(date);
      return result;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    bookTicket,
    cancelTicket,
    getDailyCash,
    loading,
    error,
  };
};
