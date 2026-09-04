using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface ITicketService
{
    // =========================================================
    // GET
    // =========================================================

    Task<IEnumerable<TicketResponse>> GetAllAsync();

    Task<IEnumerable<TicketResponse>> GetByPNRAsync(string pnr);

    Task<TicketResponse?> GetByIdAsync(int id);

    Task<IEnumerable<TicketResponse>> GetByUserIdAsync(int userId);

    // =========================================================
    // CREATE
    // =========================================================

    Task<TicketResponse> CreateAsync(TicketCreateRequest dto);

    // =========================================================
    // UPDATE
    // =========================================================

    Task<bool> UpdateAsync(int id, TicketUpdateRequest dto);

    // =========================================================
    // CANCEL
    // =========================================================

    Task<bool> CancelAsync(string pnr, string reason);

    Task<bool> IsCancellableAsync(int ticketId);

    Task<TicketResponse?> GetCancellationContextAsync(int ticketId);

    // =========================================================
    // DELETE
    // =========================================================

    Task<bool> DeleteAsync(int id);
}