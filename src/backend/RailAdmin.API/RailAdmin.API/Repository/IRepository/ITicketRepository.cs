using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface ITicketRepository
{
    Task<IEnumerable<Ticket>> GetAllAsync();
    Task<IEnumerable<Ticket>> GetByPNRAsync(string pnr);
    Task<Ticket?> GetByIdAsync(int id);
    Task<Ticket> CreateAsync(Ticket ticket);
    Task<bool> UpdateAsync(Ticket ticket);
    Task<bool> DeleteAsync(int id);
}