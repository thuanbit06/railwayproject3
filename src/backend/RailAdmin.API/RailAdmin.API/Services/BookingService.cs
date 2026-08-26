using RailAdmin.API.DTOs.Request.Booking;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _repo;
    public BookingService(IBookingRepository repo) { _repo = repo; }

    public async Task<IEnumerable<BookingResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<BookingResponse?> GetByPNRAsync(string pnr)
    {
        var item = await _repo.GetByPNRAsync(pnr);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<IEnumerable<BookingResponse>> GetByUserIdAsync(int userId)
    {
        var list = await _repo.GetByUserIdAsync(userId);
        return list.Select(MapToResponse);
    }

    public async Task<BookingResponse> CreateAsync(BookingCreateRequest dto)
    {
        var booking = new Booking
        {
            PNR = "PNR" + new Random().Next(100000, 999999),
            UserId = dto.UserId,
            TripId = dto.TripId,
            TotalPassengers = dto.TotalPassengers,
            TotalAmount = 0, // Tính toán động hoặc cập nhật sau khi tạo tickets
            BookingStatus = "Confirmed",
            BookingDate = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(booking);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(string pnr, BookingUpdateRequest dto)
    {
        var booking = new Booking
        {
            PNR = pnr,
            BookingStatus = dto.BookingStatus
        };
        return await _repo.UpdateAsync(booking);
    }

    public async Task<bool> DeleteAsync(string pnr) => await _repo.DeleteAsync(pnr);

    private static BookingResponse MapToResponse(Booking b) => new()
    {
        PNR = b.PNR,
        UserId = b.UserId,
        TripId = b.TripId,
        TotalPassengers = b.TotalPassengers,
        TotalAmount = b.TotalAmount,
        BookingStatus = b.BookingStatus,
        BookingDate = b.BookingDate
    };
}