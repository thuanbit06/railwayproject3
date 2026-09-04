using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface IPaymentRepository
{
    Task<IEnumerable<Payment>> GetAllAsync();
    Task<Payment?> GetByIdAsync(int id);
    Task<Payment?> GetByPNRAsync(string pnr);
    Task<Payment> CreateAsync(Payment payment);
    Task<bool> UpdateAsync(Payment payment);
    Task<bool> DeleteAsync(int id);
    Task<Payment?> GetSuccessfulPaymentByPNRAsync(  
        string pnr);
}