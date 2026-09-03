using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ISeatRepository
{
    Task<IEnumerable<Seat>> GetAllAsync();

    Task<Seat?> GetByIdAsync(int id);

    Task<IEnumerable<Seat>> GetByCoachIdAsync(int coachId);

    Task<bool> SeatExistsAsync(int seatId);

    Task<bool> SeatBelongsToTripAsync(int seatId, string pnr);

    Task<bool> SeatIsAlreadyBookedAsync(int seatId, string pnr);

    Task<Seat> AddAsync(Seat seat);

    Task<bool> UpdateAsync(Seat seat);

    Task<bool> DeleteAsync(int id);
}