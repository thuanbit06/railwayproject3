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
    private readonly ITicketRepository _ticketRepository;
    private readonly IPaymentService _paymentService;

    public BookingService(
        IBookingRepository bookingRepository,
        ITicketRepository ticketRepository,
        IPaymentService paymentService
    )
    {
        _bookingRepository = bookingRepository;
        _ticketRepository = ticketRepository;
        _paymentService = paymentService;

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

    // =========================================================
    // UPDATE BOOKING STATUS
    // =========================================================

    public async Task<bool> UpdateAsync(
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

        pnr = pnr.Trim();

        // -----------------------------------------------------
        // Get existing booking
        // -----------------------------------------------------

        var existing =
            await _repo.GetByPNRAsync(pnr);

        if (existing == null)
        {
            return false;
        }

        // -----------------------------------------------------
        // Validate status
        // -----------------------------------------------------

        if (string.IsNullOrWhiteSpace(
                dto.BookingStatus))
        {
            throw new ArgumentException(
                "Booking status is required.",
                nameof(dto.BookingStatus));
        }

        var status =
            dto.BookingStatus.Trim();

        var allowedStatuses = new[]
        {
            "Confirmed",
            "Pending",
            "Cancelled"
        };

        if (!allowedStatuses.Contains(
                status,
                StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "Booking status must be Confirmed, Pending, or Cancelled.",
                nameof(dto.BookingStatus));
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
        status = allowedStatuses.First(
            x => x.Equals(
                status,
                StringComparison.OrdinalIgnoreCase));

        // -----------------------------------------------------
        // Prevent invalid transition
        // -----------------------------------------------------

        if (existing.BookingStatus == "Cancelled" &&
            status != "Cancelled")
        {
            throw new InvalidOperationException(
                $"Booking '{pnr}' has already been cancelled and cannot be reactivated.");
        }

        // -----------------------------------------------------
        // Update
        // -----------------------------------------------------

        var booking = new Booking
        {
            return false;
        }
            PNR = existing.PNR,

            UserId = existing.UserId,

            TripId = existing.TripId,

            TotalPassengers =
                existing.TotalPassengers,

            TotalAmount =
                existing.TotalAmount,

            BookingStatus = status,

            BookingDate =
                existing.BookingDate
        };

        return await _repo.UpdateAsync(booking);
    }

        // Validate quy trình chuyển đổi trạng thái (state transition)
        ValidateStatusTransition(booking.BookingStatus, dto.BookingStatus);

        // Tùy chọn: Nếu DTO có chứa các trường khác ngoài Status (vd: TotalPassengers),
        // bạn có thể gán lại cho model ở đây trước khi gọi Repository update.
        booking.BookingStatus = dto.BookingStatus;

        return await _bookingRepository.UpdateStatusAsync(booking.PNR, dto.BookingStatus);
    }
    // =========================================================
    // CANCEL BOOKING
    //
    // Workflow:
    //
    // Booking
    //    ↓
    // Cancel Tickets
    //    ↓
    // Release Seats
    //    ↓
    // TotalAmount = 0
    //    ↓
    // Booking = Cancelled
    //    ↓
    // Refund Payment
    // =========================================================

    public async Task<bool> CancelAsync(
    string pnr,
    string reason)
    {
        // =====================================================
        // VALIDATE PNR
        // =====================================================

        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));
        }

        pnr = pnr.Trim();

        // =====================================================
        // BEGIN TRANSACTION
        // =====================================================

        await using var transaction =
            await _db.Database.BeginTransactionAsync();

        try
        {
            // =================================================
            // GET BOOKING
            // =================================================

            var booking =
                await _repo.GetByPNRAsync(pnr);

            if (booking == null)
            {
                throw new KeyNotFoundException(
                    $"Booking with PNR '{pnr}' was not found.");
            }

            // =================================================
            // CHECK STATUS
            // =================================================

            if (string.Equals(
                    booking.BookingStatus,
                    "Cancelled",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    $"Booking '{pnr}' has already been cancelled.");
            }

            // =================================================
            // CANCEL REASON
            // =================================================

            var cancelReason =
                string.IsNullOrWhiteSpace(reason)
                    ? "Booking cancelled by administrator."
                    : reason.Trim();

            // =================================================
            // STEP 1
            // CANCEL ALL TICKETS
            // =================================================

            await _ticketRepository
                .CancelAllByPNRAsync(
                    pnr,
                    cancelReason);

            // =================================================
            // STEP 2
            // UPDATE BOOKING
            // =================================================

            var bookingUpdate = new Booking
            {
                PNR = booking.PNR,

                UserId = booking.UserId,

                TripId = booking.TripId,

                TotalPassengers =
                    booking.TotalPassengers,

                TotalAmount = 0,

                BookingStatus = "Cancelled",

                BookingDate =
                    booking.BookingDate
            };

            var updated =
                await _repo.UpdateAsync(
                    bookingUpdate);

            if (!updated)
            {
                throw new InvalidOperationException(
                    $"Unable to cancel booking '{pnr}'.");
            }

            // =================================================
            // STEP 3
            // RESET TOTAL AMOUNT
            // =================================================

            await _repo.UpdateTotalAmountAsync(
                pnr,
                0);

            // =================================================
            // STEP 4
            // REFUND PAYMENT
            // =================================================

            try
            {
                await _paymentService
                    .RefundAsync(pnr);
            }
            catch (KeyNotFoundException)
            {
                // Booking không có Payment.
                // Không cần refund.
            }

            // =================================================
            // STEP 5
            // COMMIT
            // =================================================

            await transaction.CommitAsync();

            return true;
        }
        catch
        {
            // =================================================
            // ROLLBACK
            // =================================================

            await transaction.RollbackAsync();

            throw;
        }
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));
        }

        pnr = pnr.Trim();

        var booking =
            await _repo.GetByPNRAsync(pnr);

        if (booking == null)
        {
            return false;
        }

        // -----------------------------------------------------
        // Do not delete active booking
        // -----------------------------------------------------

        if (!string.Equals(
                booking.BookingStatus,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                $"Booking '{pnr}' must be cancelled before it can be deleted.");
        }

        return await _repo.DeleteAsync(pnr);
    }

    // =========================================================
    // GENERATE PNR
    // =========================================================

    private static string GeneratePNR()
    {
        return "PNR" +
               Random.Shared.Next(
                   100000,
                   1000000);
    }

    // =========================================================
    // MAP RESPONSE
    // =========================================================

    public async Task<bool> DeleteAsync(string pnr)
    {
        // Trong hệ thống đặt vé, Delete đồng nghĩa với việc Hủy đơn (Cancel)
        // Gọi lại logic CancelAsync có sẵn để đảm bảo tuân thủ đúng business rules
        return await CancelAsync(pnr);
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

            TotalPassengers =
                booking.TotalPassengers,

            TotalAmount =
                booking.TotalAmount,

            BookingStatus =
                booking.BookingStatus,

            BookingDate =
                booking.BookingDate
        };
    }
}