using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ITripStopRepository
{
    Task<IEnumerable<TripStop>> GetAllAsync();
    Task<IEnumerable<TripStop>> GetByTripIdAsync(int tripId);
    Task<TripStop?> GetByIdAsync(int id);
    Task<TripStop> CreateAsync(TripStop stop);
    Task<bool> UpdateAsync(TripStop stop);
    Task<bool> DeleteAsync(int id);
}