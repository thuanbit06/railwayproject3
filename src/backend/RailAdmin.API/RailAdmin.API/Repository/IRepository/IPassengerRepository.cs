using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;
    public interface IPassengerRepository 
    { 
        Task<IEnumerable<Passenger>> GetAllAsync(); 
        Task<Passenger?> GetByIdAsync(int id); 
        Task<Passenger> CreateAsync(Passenger passenger); 
        Task<bool> UpdateAsync(Passenger passenger); 
        Task<bool> DeleteAsync(int id); 
    }
