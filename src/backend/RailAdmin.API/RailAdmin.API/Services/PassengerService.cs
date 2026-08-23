using RailAdmin.API.DTOs.Passenger;
using RailAdmin.API.Models;
using RailAdmin.API.Repository;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;
namespace RailAdmin.API.Services
{
    public class PassengerService : IPassengerService 
    { 
        private readonly IPassengerRepository _repository; 
        public PassengerService(IPassengerRepository repository) 
        { 
            _repository = repository; 
        } 
        public async Task<IEnumerable<PassengerDto>> GetAllAsync() 
        { 
            var passengers = await _repository.GetAllAsync(); 
            return passengers.Select(MapToDto); 
        } 
        public async Task<PassengerDto?> GetByIdAsync(int id) 
        { 
            var passenger = await _repository.GetByIdAsync(id); 
            if (passenger == null) 
                return null; 
            return MapToDto(passenger); 
        } 
        public async Task<PassengerDto> CreateAsync(CreatePassengerDto dto) 
        { 
            var passenger = new Passenger 
            { 
                FullName = dto.FullName,
                Age = dto.Age, 
                Gender = dto.Gender, 
                IDProofType = dto.IDProofType, 
                IDProofNo = dto.IDProofNo, 
                Email = dto.Email, Phone = dto.Phone
            }; 
            var createdPassenger = await _repository.CreateAsync(passenger); 
            return MapToDto(createdPassenger); } 
        public async Task<bool> UpdateAsync(int id, UpdatePassengerDto dto) 
        { 
            var passenger = new Passenger 
            { 
                Id = id, 
                FullName = dto.FullName, 
                Age = dto.Age, 
                Gender = dto.Gender, 
                IDProofType = dto.IDProofType, 
                IDProofNo = dto.IDProofNo, 
                Email = dto.Email, 
                Phone = dto.Phone 
            }; 
            return await _repository.UpdateAsync(passenger); } 
        public async Task<bool> DeleteAsync(int id) 
        { 
            return await _repository.DeleteAsync(id);
        } 
        private static PassengerDto MapToDto(Passenger passenger) 
        { 
            return new PassengerDto 
            { 
                Id = passenger.Id, 
                FullName = passenger.FullName, 
                Age = passenger.Age, 
                Gender = passenger.Gender, 
                IDProofType = passenger.IDProofType, 
                IDProofNo = passenger.IDProofNo, 
                Email = passenger.Email, 
                Phone = passenger.Phone 
            }; 
        } 
    }
}


