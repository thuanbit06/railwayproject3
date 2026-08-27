using RailAdmin.API.DTOs.Request.Train;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface ITrainService
{
    Task<IEnumerable<TrainResponse>> GetAllAsync();

    Task<TrainResponse?> GetByIdAsync(int id);

    Task<IEnumerable<TrainResponse>> SearchAsync(
        TrainSearchRequest request);

    Task<TrainResponse> CreateAsync(
        TrainCreateRequest request);

    Task<bool> UpdateAsync(
        int id,
        TrainUpdateRequest request);

    Task<bool> DeleteAsync(int id);

    Task<bool> UpdateStatusAsync(
        int id,
        bool isActive);
}