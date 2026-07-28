// frontend/src/features/query/useQuery.js (bổ sung mock fallback)
import { useState, useCallback } from "react";
import { bookingService } from "../../services/bookingService";
import { getMockBookingByPNR } from "../../data";

export const useQuery = () => {
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usedMock, setUsedMock] = useState(false);

  const searchByPNR = useCallback(async (pnr) => {
    setLoading(true);
    setError(null);
    setUsedMock(false);

    try {
      // Thử gọi API trước
      const result = await bookingService.getByPNR(pnr);
      setTicket(result);
      return result;
    } catch (err) {
      console.warn("API unavailable, using mock data:", err);
      // Fallback sang mock
      const mockTicket = getMockBookingByPNR(pnr);
      if (mockTicket) {
        setTicket(mockTicket);
        setUsedMock(true);
        return mockTicket;
      }
      setError("PNR not found (both API and local data)");
      setTicket(null);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setTicket(null);
    setError(null);
    setUsedMock(false);
  }, []);

  return { ticket, loading, error, searchByPNR, clearResult, usedMock };
};
