using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface ITicketService
{
    Task<IEnumerable<TicketResponse>> GetAllAsync();

    Task<IEnumerable<TicketResponse>> GetByPNRAsync(string pnr);

    Task<TicketResponse?> GetByIdAsync(int id);

    Task<TicketResponse> CreateAsync(
        TicketCreateRequest dto);

    Task<bool> UpdateAsync(
        int id,
        TicketUpdateRequest dto);

    Task<bool> DeleteAsync(int id);

    // Hủy toàn bộ vé theo PNR
    Task<bool> CancelAsync(
        string pnr,
        string reason);

    Task<bool> IsCancellableAsync(
        int ticketId);

    Task<TicketResponse?> GetCancellationContextAsync(
        int ticketId);

    Task<IEnumerable<TicketResponse>> GetByUserIdAsync(
        int userId);
}