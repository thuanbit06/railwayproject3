import api from "./api";

// =====================================================
// ADMIN
// =====================================================

export const getTickets = () => api.get("/admin/tickets");

export const deleteTicket = (id) => api.delete(`/admin/tickets/${id}`);

// =====================================================
// USER - MY TICKETS
// =====================================================

export const getMyTickets = () => api.get("/tickets/my-tickets");

// =====================================================
// GET TICKET BY ID
// =====================================================

export const getTicketById = (id) => api.get(`/tickets/${id}`);

// =====================================================
// GET TICKETS BY PNR
// =====================================================

export const getTicketByPNR = (pnr) => api.get(`/tickets/pnr/${pnr}`);

// =====================================================
// PNR STATUS
// =====================================================

export const checkPnrStatus = (pnr) => api.get(`/tickets/pnr/${pnr}`);

// =====================================================
// CANCEL BOOKING BY PNR
// PUT /api/tickets/{pnr}/cancel
// =====================================================

export const cancelTicket = (pnr, reason = "Ticket cancelled by user.") =>
  api.put(`/tickets/${pnr}/cancel`, {
    reason,
  });
