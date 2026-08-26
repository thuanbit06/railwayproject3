using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ICancellationRuleRepository
{
    Task<IEnumerable<CancellationRule>> GetAllAsync();
    Task<CancellationRule?> GetByIdAsync(int id);
    Task<CancellationRule> CreateAsync(CancellationRule rule);
    Task<bool> UpdateAsync(CancellationRule rule);
    Task<bool> DeleteAsync(int id);
}