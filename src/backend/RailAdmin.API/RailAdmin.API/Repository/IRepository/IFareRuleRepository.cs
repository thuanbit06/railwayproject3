using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface IFareRuleRepository
{
    Task<IEnumerable<FareRule>> GetAllAsync();
    Task<FareRule?> GetByIdAsync(int id);
    Task<FareRule?> GetByClassAndTrainTypeAsync(
    string seatClass,
    string trainType);
    Task<FareRule> CreateAsync(FareRule rule);
    Task<bool> UpdateAsync(FareRule rule);
    Task<bool> DeleteAsync(int id);
}