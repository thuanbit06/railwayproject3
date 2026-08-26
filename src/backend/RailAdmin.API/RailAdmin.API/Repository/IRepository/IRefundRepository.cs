using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface IRefundRepository
{
    Task<IEnumerable<Refund>> GetAllAsync();
    Task<Refund?> GetByIdAsync(int id);
    Task<Refund?> GetByTicketIdAsync(int ticketId);
    Task<Refund> CreateAsync(Refund refund);
    Task<bool> UpdateAsync(Refund refund);
    Task<bool> DeleteAsync(int id);
}