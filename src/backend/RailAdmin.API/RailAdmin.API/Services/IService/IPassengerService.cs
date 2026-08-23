using RailAdmin.API.DTOs.Passenger;
namespace RailAdmin.API.Services.IService
{
    public interface IPassengerService 
    { 
        Task<IEnumerable<PassengerDto>> GetAllAsync();
        Task<PassengerDto?> GetByIdAsync(int id); 
        Task<PassengerDto> CreateAsync(CreatePassengerDto dto); 
        Task<bool> UpdateAsync(int id, UpdatePassengerDto dto); 
        Task<bool> DeleteAsync(int id); 
    }
}
