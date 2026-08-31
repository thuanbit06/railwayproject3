using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ISeatRepository
{
    Task<IEnumerable<Seat>> GetAllAsync();

    Task<IEnumerable<Seat>> GetByCoachIdAsync(int coachId);

    Task<Seat?> GetByIdAsync(int id);

    Task<bool> CoachExistsAsync(int coachId);

    Task<bool> SeatNoExistsAsync(
        int coachId,
        string seatNo,
        int? excludeId = null);

    Task<Seat> CreateAsync(Seat seat);

    Task<bool> UpdateAsync(Seat seat);

    Task<bool> DeleteAsync(int id);
    Task<bool> IsAvailableAsync(int seatId);
    Task<bool> IsOwnedByTicketAsync(int seatId, int ticketId);
    Task<bool> ReleaseAsync(int seatId);
}