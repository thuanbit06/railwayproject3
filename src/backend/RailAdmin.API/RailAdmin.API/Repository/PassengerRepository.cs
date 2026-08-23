using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
public class PassengerRepository : IPassengerRepository
    { 
        private readonly AppDbContext _db; 
        public PassengerRepository(AppDbContext db) { _db = db; } 
        public async Task<IEnumerable<Passenger>> GetAllAsync() 
        { 
            return await _db.Passengers.AsNoTracking().ToListAsync(); 
        }
        public async Task<Passenger?> GetByIdAsync(int id) 
        { 
            return await _db.Passengers.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id); 
        } 
        public async Task<Passenger> CreateAsync(Passenger passenger) 
        { 
            _db.Passengers.Add(passenger); 
            await _db.SaveChangesAsync(); 
            return passenger; 
        } 
        public async Task<bool> UpdateAsync(Passenger passenger) 
        { 
            var existingPassenger = await _db.Passengers.FirstOrDefaultAsync(p => p.Id == passenger.Id); 
            if (existingPassenger == null)
                return false; 
            existingPassenger.FullName = passenger.FullName; 
            existingPassenger.Age = passenger.Age; 
            existingPassenger.Gender = passenger.Gender; 
            existingPassenger.IDProofType = passenger.IDProofType; 
            existingPassenger.IDProofNo = passenger.IDProofNo; 
            existingPassenger.Email = passenger.Email; 
            existingPassenger.Phone = passenger.Phone; 
            await _db.SaveChangesAsync(); return true; 
        } 
        public async Task<bool> DeleteAsync(int id) 
        { 
            var passenger = await _db.Passengers.FirstOrDefaultAsync(p => p.Id == id); 
            if (passenger == null) 
                return false; 
            _db.Passengers.Remove(passenger); 
            await _db.SaveChangesAsync(); return true; 
        } 
    }
