using RailAdmin.API.DTOs.Request.Booking;
using RailAdmin.API.DTOs.Response;

namespace RailAdmin.API.Services.IService;

public interface IBookingService
{
    Task<IEnumerable<BookingResponse>> GetAllAsync();
    Task<BookingResponse?> GetByPNRAsync(string pnr);
    Task<IEnumerable<BookingResponse>> GetByUserIdAsync(int userId);
    Task<BookingResponse> CreateAsync(BookingCreateRequest dto);
    Task<bool> UpdateAsync(string pnr, BookingUpdateRequest dto);
    Task<bool> DeleteAsync(string pnr);
    Task<bool> CancelAsync(string pnr);
    Task<bool> UpdateStatusAsync(string pnr, BookingUpdateRequest dto);
}