using RailAdmin.API.Data;
using RailAdmin.API.DTOs.Request.Booking;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class BookingService : IBookingService
{
    private readonly IBookingRepository _repo;
    private readonly ITicketRepository _ticketRepository;
    private readonly IPaymentService _paymentService;
    private readonly AppDbContext _db;

    public BookingService(
    IBookingRepository repo,
    ITicketRepository ticketRepository,
    IPaymentService paymentService,
    AppDbContext db)
    {
        _repo = repo;
        _ticketRepository = ticketRepository;
        _paymentService = paymentService;
        _db = db;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<BookingResponse>> GetAllAsync()
    {
        var bookings = await _repo.GetAllAsync();

        return bookings.Select(MapToResponse);
    }

    // =========================================================
    // GET BY PNR
    // =========================================================

    public async Task<BookingResponse?> GetByPNRAsync(
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
            return null;
        }

        return MapToResponse(booking);
    }

    // =========================================================
    // GET BY USER
    // =========================================================

    public async Task<IEnumerable<BookingResponse>> GetByUserIdAsync(
        int userId)
    {
        if (userId <= 0)
        {
            throw new ArgumentException(
                "User ID must be greater than 0.",
                nameof(userId));
        }

        var bookings =
            await _repo.GetByUserIdAsync(userId);

        return bookings.Select(MapToResponse);
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<BookingResponse> CreateAsync(
        BookingCreateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        // -----------------------------------------------------
        // Validate User
        // -----------------------------------------------------

        if (dto.UserId <= 0)
        {
            throw new ArgumentException(
                "User ID must be greater than 0.",
                nameof(dto.UserId));
        }

        // -----------------------------------------------------
        // Validate Trip
        // -----------------------------------------------------

        if (dto.TripId <= 0)
        {
            throw new ArgumentException(
                "Trip ID must be greater than 0.",
                nameof(dto.TripId));
        }

        // -----------------------------------------------------
        // Validate passengers
        // -----------------------------------------------------

        if (dto.TotalPassengers <= 0)
        {
            throw new ArgumentException(
                "TotalPassengers must be greater than 0.",
                nameof(dto.TotalPassengers));
        }

        // -----------------------------------------------------
        // Generate unique PNR
        // -----------------------------------------------------

        string pnr;

        do
        {
            pnr = GeneratePNR();
        }
        while (await _repo.GetByPNRAsync(pnr) != null);

        // -----------------------------------------------------
        // Create booking
        // -----------------------------------------------------

        var booking = new Booking
        {
            PNR = pnr,

            UserId = dto.UserId,

            TripId = dto.TripId,

            TotalPassengers =
                dto.TotalPassengers,

            TotalAmount = 0,

            BookingStatus = "Confirmed",

            BookingDate = DateTime.UtcNow
        };

        var created =
            await _repo.CreateAsync(booking);

        return MapToResponse(created);
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