using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface IWaitListRepository
{
    Task<IEnumerable<WaitList>> GetAllAsync();
    Task<IEnumerable<WaitList>> GetByTripIdAsync(int tripId);
    Task<WaitList?> GetByIdAsync(int id);
    Task<int> GetNextPositionAsync(int tripId, string requestedClass);
    Task<WaitList> CreateAsync(WaitList waitList);
    Task<bool> UpdateAsync(WaitList waitList);
    Task<bool> DeleteAsync(int id);
}