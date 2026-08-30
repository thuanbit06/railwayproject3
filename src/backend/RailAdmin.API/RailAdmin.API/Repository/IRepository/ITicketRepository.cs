using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetAllAsync();

    Task<IEnumerable<Ticket>> GetByPNRAsync(string pnr);

    Task<Ticket?> GetByIdAsync(int id);
    Task<Trip?> GetTripByPNRAsync(string pnr);

    Task<Ticket> CreateAsync(Ticket ticket);

    Task<bool> UpdateAsync(Ticket ticket);

    Task<bool> DeleteAsync(int id);

    Task<bool> BookingExistsAsync(string pnr);

    Task<bool> SeatExistsAsync(int seatId);

    Task<bool> SeatIsAlreadyBookedAsync(
        int seatId,
        string pnr);

    Task<bool> SeatBelongsToTripAsync(
        int seatId,
        string pnr);

    Task<int> CountByPNRAsync(string pnr);

    Task<int> CountActiveTicketsByPNRAsync(string pnr);

    Task<decimal> GetTotalFareByPNRAsync(string pnr);

    Task<decimal> GetActiveTotalFareByPNRAsync(string pnr);
    Task<bool> CancelAllByPNRAsync(
    string pnr,
    string reason);
}