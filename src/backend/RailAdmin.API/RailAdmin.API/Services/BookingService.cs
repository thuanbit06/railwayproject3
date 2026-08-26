using RailAdmin.API.Data.Constants;
using RailAdmin.API.DTOs.Request.Booking;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _bookingRepository;

    public BookingService(
        IBookingRepository bookingRepository)
    {
        _bookingRepository = bookingRepository;
    }

    public async Task<IEnumerable<BookingResponse>> GetAllAsync()
    {
        var bookings = await _bookingRepository.GetAllAsync();

        return bookings.Select(MapToResponse);
    }

    public async Task<BookingResponse?> GetByPNRAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));
        }

        var booking = await _bookingRepository
            .GetByPNRAsync(pnr.Trim());

        return booking == null
            ? null
            : MapToResponse(booking);
    }

    public async Task<IEnumerable<BookingResponse>> GetByUserIdAsync(
        int userId)
    {
        if (userId <= 0)
        {
            throw new ArgumentException(
                "User ID must be greater than 0.",
                nameof(userId));
        }

        var bookings = await _bookingRepository
            .GetByUserIdAsync(userId);

        return bookings.Select(MapToResponse);
    }

    public async Task<BookingResponse> CreateAsync(
        BookingCreateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        ValidateCreateRequest(dto);

        var pnr = await GenerateUniquePNRAsync();

        var booking = new Booking
        {
            PNR = pnr,
            UserId = dto.UserId,
            TripId = dto.TripId,
            TotalPassengers = dto.TotalPassengers,

            // The actual amount should be calculated
            // from tickets/fare rules later.
            TotalAmount = 0,

            // Booking is initially pending.
            BookingStatus = BookingStatus.Pending,

            BookingDate = DateTime.UtcNow
        };

        var createdBooking =
            await _bookingRepository.CreateAsync(booking);

        return MapToResponse(createdBooking);
    }

    public async Task<bool> UpdateStatusAsync(
        string pnr,
        BookingUpdateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));
        }

        var booking = await _bookingRepository
            .GetByPNRAsync(pnr.Trim());

        if (booking == null)
        {
            return false;
        }

        ValidateStatusTransition(
            booking.BookingStatus,
            dto.BookingStatus);

        return await _bookingRepository.UpdateStatusAsync(
            booking.PNR,
            dto.BookingStatus);
    }

    public async Task<bool> CancelAsync(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));
        }

        var booking = await _bookingRepository
            .GetByPNRAsync(pnr.Trim());

        if (booking == null)
        {
            return false;
        }

        if (booking.BookingStatus ==
            BookingStatus.Cancelled)
        {
            return true;
        }

        if (booking.BookingStatus ==
            BookingStatus.Completed)
        {
            throw new InvalidOperationException(
                "A completed booking cannot be cancelled.");
        }

        return await _bookingRepository.CancelAsync(
            booking.PNR);
    }

    private async Task<string> GenerateUniquePNRAsync()
    {
        const int maxAttempts = 10;

        for (var attempt = 0;
             attempt < maxAttempts;
             attempt++)
        {
            var pnr =
                $"PNR{Random.Shared.Next(100000, 999999)}";

            var exists =
                await _bookingRepository
                    .ExistsByPNRAsync(pnr);

            if (!exists)
            {
                return pnr;
            }
        }

        throw new InvalidOperationException(
            "Unable to generate a unique PNR.");
    }

    private static void ValidateCreateRequest(
        BookingCreateRequest dto)
    {
        if (dto.UserId <= 0)
        {
            throw new ArgumentException(
                "User ID must be greater than 0.");
        }

        if (dto.TripId <= 0)
        {
            throw new ArgumentException(
                "Trip ID must be greater than 0.");
        }

        if (dto.TotalPassengers <= 0)
        {
            throw new ArgumentException(
                "Total passengers must be greater than 0.");
        }
    }

    private static void ValidateStatusTransition(
        string currentStatus,
        string newStatus)
    {
        if (string.IsNullOrWhiteSpace(newStatus))
        {
            throw new ArgumentException(
                "Booking status is required.");
        }

        if (currentStatus.Equals(
                BookingStatus.Cancelled,
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "A cancelled booking cannot be updated.");
        }

        if (currentStatus.Equals(
                BookingStatus.Completed,
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "A completed booking cannot be updated.");
        }

        var allowedStatuses = new[]
        {
            BookingStatus.Pending,
            BookingStatus.Confirmed,
            BookingStatus.Cancelled,
            BookingStatus.Completed,
            BookingStatus.Expired
        };

        if (!allowedStatuses.Contains(
                newStatus,
                StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                $"Invalid booking status: {newStatus}");
        }
    }

    private static BookingResponse MapToResponse(
        Booking booking)
    {
        return new BookingResponse
        {
            PNR = booking.PNR,
            UserId = booking.UserId,
            TripId = booking.TripId,
            TotalPassengers = booking.TotalPassengers,
            TotalAmount = booking.TotalAmount,
            BookingStatus = booking.BookingStatus,
            BookingDate = booking.BookingDate
        };
    }

    public async Task<bool> UpdateAsync(string pnr, BookingUpdateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException("PNR is required.", nameof(pnr));
        }

        var booking = await _bookingRepository.GetByPNRAsync(pnr.Trim());
        if (booking == null)
        {
            return false;
        }

        // Validate quy trình chuyển đổi trạng thái (state transition)
        ValidateStatusTransition(booking.BookingStatus, dto.BookingStatus);

        // Tùy chọn: Nếu DTO có chứa các trường khác ngoài Status (vd: TotalPassengers),
        // bạn có thể gán lại cho model ở đây trước khi gọi Repository update.
        booking.BookingStatus = dto.BookingStatus;

        return await _bookingRepository.UpdateStatusAsync(booking.PNR, dto.BookingStatus);
    }

    public async Task<bool> DeleteAsync(string pnr)
    {
        // Trong hệ thống đặt vé, Delete đồng nghĩa với việc Hủy đơn (Cancel)
        // Gọi lại logic CancelAsync có sẵn để đảm bảo tuân thủ đúng business rules
        return await CancelAsync(pnr);
    }
}