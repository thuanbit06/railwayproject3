using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ITicketRepository
{
    Task<Ticket?> GetByIdWithBookingAsync(int ticketId);
    Task<IEnumerable<Ticket>> GetAllAsync();
    Task<IEnumerable<Ticket>> GetByPNRAsync(string pnr);
    Task<Ticket?> GetByIdAsync(int id);
    Task<Ticket> CreateAsync(Ticket ticket);
    Task<bool> UpdateAsync(Ticket ticket);
    Task<bool> DeleteAsync(int id);
    Task<bool> CancelAsync(int ticketId,string? cancelReason,DateTime cancelledAt);
    Task<bool> ReleaseSeatAsync(int seatId);
    Task<Ticket?> GetByIdWithBookingAndTripAsync(int id);
}