using RailAdmin.API.DTOs.Request.Coach;
using RailAdmin.API.DTOs.Response;
namespace RailAdmin.API.Services.IService;

public interface ITrainCoachService
{
    Task<IEnumerable<TrainCoachResponse>> GetAllAsync();
    Task<IEnumerable<TrainCoachResponse>> GetByTrainIdAsync(int trainId);
    Task<TrainCoachResponse?> GetByIdAsync(int id);
    Task<TrainCoachResponse> CreateAsync(TrainCoachCreateRequest dto);
    Task<bool> UpdateAsync(int id, TrainCoachUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
}