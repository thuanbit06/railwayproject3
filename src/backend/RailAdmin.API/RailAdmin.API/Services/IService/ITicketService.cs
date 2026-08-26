using RailAdmin.API.DTOs.Request.Ticket;

namespace RailAdmin.API.Services.IService;

public interface ITicketService
{
    Task<IEnumerable<TicketResponse>> GetAllAsync();
    Task<IEnumerable<TicketResponse>> GetByPNRAsync(string pnr);
    Task<TicketResponse?> GetByIdAsync(int id);
    Task<TicketResponse> CreateAsync(TicketCreateRequest dto);
    Task<bool> UpdateAsync(int id, TicketUpdateRequest dto);
    Task<bool> DeleteAsync(int id);
}