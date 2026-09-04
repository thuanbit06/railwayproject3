using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface IRefundRepository
{
    Task<IEnumerable<Refund>> GetAllAsync();

    Task<Refund?> GetByIdAsync(int id);

    Task<Refund?> GetByTicketIdAsync(int ticketId);

    Task<bool> ExistsForTicketAsync(int ticketId);

    Task<Refund> CreateAsync(Refund refund);

    Task<bool> UpdateStatusAsync(int id, string status, string reason);

    Task<bool> DeleteAsync(int id);
    Task<bool> UpdateAsync(Refund refund);

    Task<Refund?> GetByIdempotencyKeyAsync(string idempotencyKey);

}