using RailAdmin.API.DTOs.Request.Train;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface ITrainService
{
    Task<IEnumerable<TrainResponse>> GetAllAsync();
    Task<TrainResponse?> GetByIdAsync(int id);
    Task<TrainResponse> CreateAsync(TrainCreateRequest dto);
    Task<bool> UpdateAsync(int id, TrainUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
}