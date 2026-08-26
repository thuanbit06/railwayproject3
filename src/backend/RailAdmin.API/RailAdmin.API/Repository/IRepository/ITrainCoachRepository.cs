using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ITrainCoachRepository
{
    Task<IEnumerable<TrainCoach>> GetAllAsync();
    Task<IEnumerable<TrainCoach>> GetByTrainIdAsync(int trainId);
    Task<TrainCoach?> GetByIdAsync(int id);
    Task<TrainCoach> CreateAsync(TrainCoach coach);
    Task<bool> UpdateAsync(TrainCoach coach);
    Task<bool> DeleteAsync(int id);
}