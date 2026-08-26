using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ISeatRepository
{
    Task<IEnumerable<Seat>> GetAllAsync();
    Task<IEnumerable<Seat>> GetByCoachIdAsync(int coachId);
    Task<Seat?> GetByIdAsync(int id);
    Task<Seat> CreateAsync(Seat seat);
    Task<bool> UpdateAsync(Seat seat);
    Task<bool> DeleteAsync(int id);
}