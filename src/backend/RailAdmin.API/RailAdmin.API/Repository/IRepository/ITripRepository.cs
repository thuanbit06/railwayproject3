using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ITripRepository
{
    Task<IEnumerable<Trip>> GetAllAsync();
    Task<Trip?> GetByIdAsync(int id);
    Task<Trip> CreateAsync(Trip trip);
    Task<bool> UpdateAsync(Trip trip);
    Task<bool> DeleteAsync(int id);
}