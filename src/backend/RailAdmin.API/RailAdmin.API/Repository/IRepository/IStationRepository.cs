using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface IStationRepository
{
    Task<IEnumerable<Station>> GetAllAsync();
    Task<Station?> GetByIdAsync(int id);
    Task<Station?> GetByCodeAsync(string code);
    Task<Station> CreateAsync(Station station);
    Task<bool> UpdateAsync(Station station);
    Task<bool> DeleteAsync(int id);
}