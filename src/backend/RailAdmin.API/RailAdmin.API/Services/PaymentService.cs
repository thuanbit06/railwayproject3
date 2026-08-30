using RailAdmin.API.DTOs.Request.Payment;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _paymentRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IPaymentRepository _repo;

    public PaymentService(
        IPaymentRepository paymentRepository,
        IPaymentRepository repo,
        IBookingRepository bookingRepository)
    {
        _repo = repo;
        _paymentRepository = paymentRepository;
        _bookingRepository = bookingRepository;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<PaymentResponse>> GetAllAsync()
    {
        var payments = await _paymentRepository.GetAllAsync();

        return payments.Select(MapToResponse);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<PaymentResponse?> GetByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Payment ID must be greater than 0.",
                nameof(id));
        }

        var payment =
            await _repo.GetByIdAsync(id);

        if (payment == null)
        {
            return null;
        }

        return MapToResponse(payment);
    }

    // =========================================================
    // GET BY PNR
    // =========================================================

    public async Task<PaymentResponse?> GetByPNRAsync(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));
        }

        var payment =
            await _paymentRepository.GetByPNRAsync(
                pnr.Trim());

        return payment == null
            ? null
            : MapToResponse(payment);
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<PaymentResponse> CreateAsync(
    PaymentCreateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        // =====================================================
        // VALIDATE PNR
        // =====================================================

        if (string.IsNullOrWhiteSpace(dto.PNR))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(dto.PNR));
        }

        var pnr = dto.PNR.Trim();

        // =====================================================
        // GET BOOKING
        // =====================================================

        var booking =
            await _bookingRepository
                .GetByPNRAsync(pnr);

        if (booking == null)
        {
            throw new KeyNotFoundException(
                $"Booking with PNR '{pnr}' was not found.");
        }

        // =====================================================
        // CHECK BOOKING STATUS
        // =====================================================

        if (booking.BookingStatus.Equals(
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                $"Booking '{pnr}' has been cancelled and cannot be paid.");
        }

        // =====================================================
        // CHECK AMOUNT
        // =====================================================

        if (dto.Amount <= 0)
        {
            throw new ArgumentException(
                "Payment amount must be greater than 0.",
                nameof(dto.Amount));
        }

        // =====================================================
        // CHECK BOOKING TOTAL
        // =====================================================

        if (booking.TotalAmount <= 0)
        {
            throw new InvalidOperationException(
                $"Booking '{pnr}' has no payable amount.");
        }

        if (dto.Amount != booking.TotalAmount)
        {
            throw new InvalidOperationException(
                $"Payment amount must equal the booking total amount of {booking.TotalAmount}.");
        }

        // =====================================================
        // VALIDATE PAYMENT METHOD
        // =====================================================

        if (string.IsNullOrWhiteSpace(dto.Method))
        {
            throw new ArgumentException(
                "Payment method is required.",
                nameof(dto.Method));
        }

        var method = dto.Method.Trim();

        var allowedMethods = new[]
        {
        "Cash",
        "Online",
        "Card"
    };

        if (!allowedMethods.Contains(
                method,
                StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "Payment method must be Cash, Online, or Card.",
                nameof(dto.Method));
        }

        method = allowedMethods.First(
            x => x.Equals(
                method,
                StringComparison.OrdinalIgnoreCase));

        // =====================================================
        // CHECK EXISTING PAYMENT
        // =====================================================

        var existingPayment =
            await _paymentRepository
                .GetByPNRAsync(pnr);

        if (existingPayment != null)
        {
            if (existingPayment.Status.Equals(
                    "Success",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    $"Booking '{pnr}' has already been paid successfully.");
            }

            if (existingPayment.Status.Equals(
                    "Pending",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    $"Booking '{pnr}' already has a pending payment.");
            }
        }

        // =====================================================
        // CREATE PAYMENT
        // =====================================================

        var payment = new Payment
        {
            PNR = pnr,

            Amount = booking.TotalAmount,

            Method = method,

            Status = "Pending",

            TransactionId = null,

            PaidAt = DateTime.UtcNow
        };

        var created =
            await _repo.CreateAsync(payment);

        return MapToResponse(created);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<bool> UpdateAsync(
        int id,
        PaymentUpdateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (id <= 0)
        {
            throw new ArgumentException(
                "Payment ID must be greater than 0.",
                nameof(id));
        }

        // -----------------------------------------------------
        // Get existing payment
        // -----------------------------------------------------

        var existing =
            await _paymentRepository
                .GetByIdAsync(id);

        if (existing == null)
        {
            return false;
        }

        // -----------------------------------------------------
        // Validate status
        // -----------------------------------------------------

        var status = dto.Status?.Trim();

        if (string.IsNullOrWhiteSpace(status))
        {
            throw new ArgumentException(
                "Payment status is required.",
                nameof(dto.Status));
        }

        var allowedStatuses = new[]
        {
        "Pending",
        "Success",
        "Failed",
        "Refunded"
         };
        if (existing.Status == "Refunded")
        {
            throw new InvalidOperationException(
                "Payment has already been refunded.");
        }
        if (!allowedStatuses.Contains(
                status,
                StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "Payment status must be Pending, Success, or Failed.",
                nameof(dto.Status));
        }

        // Chuẩn hóa Status
        status = allowedStatuses.First(
            x => x.Equals(
                status,
                StringComparison.OrdinalIgnoreCase));

        // -----------------------------------------------------
        // Prevent invalid status transition
        // -----------------------------------------------------

        if (existing.Status == "Success" &&
            status != "Success")
        {
            throw new InvalidOperationException(
                "A successful payment cannot be changed to another status.");
        }

        // -----------------------------------------------------
        // Get Booking
        // -----------------------------------------------------

        var booking =
            await _bookingRepository
                .GetByPNRAsync(existing.PNR);

        if (booking == null)
        {
            throw new KeyNotFoundException(
                $"Booking with PNR '{existing.PNR}' was not found.");
        }

        // -----------------------------------------------------
        // Transaction ID
        // -----------------------------------------------------

        var transactionId =
            dto.TransactionId?.Trim();

        if (status == "Success" &&
            string.IsNullOrWhiteSpace(transactionId))
        {
            transactionId =
                existing.TransactionId
                ?? "TXN_" +
                Guid.NewGuid()
                    .ToString("N")
                    .Substring(0, 12)
                    .ToUpper();
        }

        // -----------------------------------------------------
        // Pending
        // -----------------------------------------------------

        if (status == "Pending")
        {
            transactionId =
                string.IsNullOrWhiteSpace(transactionId)
                    ? existing.TransactionId
                    : transactionId;
        }

        // -----------------------------------------------------
        // Failed
        // -----------------------------------------------------

        if (status == "Failed")
        {
            // Payment thất bại không bắt buộc TransactionId
            transactionId =
                string.IsNullOrWhiteSpace(transactionId)
                    ? existing.TransactionId
                    : transactionId;
        }

        // -----------------------------------------------------
        // Update Payment
        // -----------------------------------------------------

        var payment = new Payment
        {
            Id = id,

            PNR = existing.PNR,

            Amount = existing.Amount,

            Method = existing.Method,

            Status = status,

            TransactionId = transactionId,

            PaidAt = existing.PaidAt
        };

        var updated =
            await _paymentRepository
                .UpdateAsync(payment);

        if (!updated)
        {
            return false;
        }

        // -----------------------------------------------------
        // Sync Booking
        // -----------------------------------------------------

        if (status == "Success")
        {
            // Thanh toán thành công
            // => Booking được xác nhận

            if (booking.BookingStatus != "Cancelled")
            {
                var bookingUpdate = new Booking
                {
                    PNR = booking.PNR,
                    BookingStatus = "Confirmed"
                };

                await _bookingRepository
                    .UpdateAsync(bookingUpdate);
            }
        }

        return true;
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Payment ID must be greater than 0.",
                nameof(id));
        }

        var existing =
            await _paymentRepository
                .GetByIdAsync(id);

        if (existing == null)
        {
            return false;
        }

        // Không nên xóa payment đã thành công
        if (existing.Status == "Success")
        {
            throw new InvalidOperationException(
                "Successful payments cannot be deleted.");
        }

        return await _paymentRepository
            .DeleteAsync(id);
    }

    // =========================================================
    // MAP
    // =========================================================

    private static PaymentResponse MapToResponse(
        Payment payment)
    {
        return new PaymentResponse
        {
            Id = payment.Id,

            PNR = payment.PNR,

            Amount = payment.Amount,

            Method = payment.Method,

            Status = payment.Status,

            TransactionId =
                payment.TransactionId,

            PaidAt = payment.PaidAt
        };
    }
    public async Task<bool> RefundAsync(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));
        }

        pnr = pnr.Trim();

        // =====================================================
        // GET PAYMENT
        // =====================================================

        var payment =
            await _paymentRepository.GetByPNRAsync(pnr);

        if (payment == null)
        {
            throw new KeyNotFoundException(
                $"Payment for PNR '{pnr}' was not found.");
        }

        // =====================================================
        // CHECK STATUS
        // =====================================================

        if (payment.Status.Equals(
                "Refunded",
                StringComparison.OrdinalIgnoreCase))
        {
            return true;
        }

        if (!payment.Status.Equals(
                "Success",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                $"Payment for PNR '{pnr}' cannot be refunded because its current status is '{payment.Status}'.");
        }

        // =====================================================
        // REFUND
        // =====================================================

        payment.Status = "Refunded";

        payment.TransactionId =
            string.IsNullOrWhiteSpace(payment.TransactionId)
                ? "REFUND_" +
                  Guid.NewGuid()
                      .ToString("N")
                      .Substring(0, 12)
                      .ToUpper()
                : "REFUND_" +
                  payment.TransactionId;

        payment.PaidAt = DateTime.UtcNow;

        return await _paymentRepository.UpdateAsync(payment);
    }
}