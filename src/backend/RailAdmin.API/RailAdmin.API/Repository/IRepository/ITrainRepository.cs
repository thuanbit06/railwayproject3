using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ITrainRepository
{
    Task<IEnumerable<Train>> GetAllAsync();
    Task<Train?> GetByIdAsync(int id);
    Task<Train?> GetByTrainNoAsync(string trainNo);
    Task<Train> CreateAsync(Train train);
    Task<bool> UpdateAsync(Train train);
    Task<bool> DeleteAsync(int id);
}