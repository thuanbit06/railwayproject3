using RailAdmin.API.DTOs.Request.Train;
using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ITrainRepository
{
    Task<IEnumerable<Train>> GetAllAsync();

    Task<Train?> GetByIdAsync(int id);

    Task<IEnumerable<Train>> SearchAsync(
        TrainSearchRequest request);

    Task<Train> CreateAsync(Train train);

    Task UpdateAsync(Train train);

    Task DeleteAsync(Train train);
}