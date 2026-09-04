using RailAdmin.API.Data.Constants;
using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class RefundService : IRefundService
{
    private readonly IRefundRepository _refundRepository;
    private readonly ICancellationService _cancellationService;
    private readonly ITicketService _ticketService;
    private readonly ISeatService _seatService;
    private readonly IPaymentGateway _paymentGateway;
    private readonly IPaymentRepository _paymentRepository;

    public RefundService(
        IRefundRepository refundRepository,
          ICancellationService cancellationService,
        ITicketService ticketService,
        ISeatService seatService,
        IPaymentGateway paymentGateway,
        IPaymentRepository paymentRepository
    )
    {
        _refundRepository = refundRepository;
        _cancellationService = cancellationService;
        _ticketService = ticketService;
        _seatService = seatService;
        _paymentGateway = paymentGateway;
        _paymentRepository = paymentRepository;
    }
    // =========================================================
    // HISTORY
    // =========================================================
    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<RefundResponse>>
        GetAllAsync()
    {
        var refunds =
            await _refundRepository.GetAllAsync();

        return refunds
             .OrderByDescending(x => x.RefundDate)
            .Select(MapToResponse);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<RefundResponse?>
        GetByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Refund ID must be greater than 0.",
                nameof(id));
        }

        var refund =
            await _refundRepository.GetByIdAsync(id);

        return refund == null
            ? null
            : MapToResponse(refund);
    }

    // =========================================================
    // GET BY TICKET
    // =========================================================

    public async Task<RefundResponse?>
        GetByTicketIdAsync(int ticketId)
    {
        if (ticketId <= 0)
        {
            throw new ArgumentException(
                "Ticket ID must be greater than 0.",
                nameof(ticketId));
        }

        var refund =
            await _refundRepository
                .GetByTicketIdAsync(ticketId);

        return refund == null
            ? null
            : MapToResponse(refund);
    }

    // =========================================================
    // CREATE REFUND
    // =========================================================

    public async Task<RefundResponse>
        CreateAsync(
            RefundCreateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (dto.TicketId <= 0)
        {
            throw new ArgumentException(
                "Ticket ID must be greater than 0.");
        }

        // -----------------------------------------------------
        // Prevent duplicate refund
        // -----------------------------------------------------

        var alreadyExists =
            await _refundRepository
                .GetByTicketIdAsync(dto.TicketId);

        if (alreadyExists != null)
        {
            throw new InvalidOperationException(
                $"A refund already exists for " +
                $"ticket {dto.TicketId}.");
        }

        // -----------------------------------------------------
        // IMPORTANT
        //
        // In the current architecture, the refund calculation
        // should come from CancellationRuleService.
        //
        // This method assumes the calculated values are obtained
        // from the ticket/cancellation workflow.
        // -----------------------------------------------------

        //throw new NotImplementedException(
        //    "CreateAsync should receive the " +
        //    "calculated cancellation result from " +
        //    "CancellationRuleService.");
        var refundAmount = dto.AmountPaid - dto.CancellationFee;

        if (refundAmount < 0)
            refundAmount = 0;

        var refund = new Refund
        {
            TicketId = dto.TicketId,

            CancellationRuleId = dto.CancellationRuleId,

            AmountPaid = dto.AmountPaid,

            CancellationFee = dto.CancellationFee,

            RefundAmount = Math.Max((dto.AmountPaid ?? 0m) - (dto.CancellationFee ?? 0m), 0m),

            RefundStatus = "PENDING",

            IdempotencyKey = $"REFUND-TICKET-{dto.TicketId}",

            RefundDate = DateTime.UtcNow
        };

        var created = await _refundRepository.CreateAsync(refund);

        return MapToResponse(created);
    }

    // =========================================================
    // CREATE REFUND FROM CALCULATION
    // =========================================================

    public async Task<RefundResponse>
        CreateFromCalculationAsync(
            int ticketId)
    {
        // 1. Check duplicate
        var existing =
            await _refundRepository.GetByTicketIdAsync(
                ticketId);

        if (existing != null)
        {
            throw new InvalidOperationException(
                $"Refund already exists for Ticket {ticketId}.");
        }

        // 2. Calculate cancellation
        var calculation =
            await _cancellationService
                .CalculateCancellationAsync(
                    ticketId);

        if (calculation == null)
        {
            throw new InvalidOperationException(
                "Unable to calculate cancellation.");
        }

        // 3. Check cancellation allowed
        if (!calculation.CanCancel)
        {
            throw new InvalidOperationException(
                calculation.RejectReason
                ?? "Cancellation is not allowed.");
        }

        // 4. Create refund PENDING
        var refund = new Refund
        {
            TicketId =
                ticketId,

            CancellationRuleId =
                calculation.CancellationRuleId,

            AmountPaid =
                calculation.Fare,

            CancellationFee =
                calculation.CancellationFee,

            RefundAmount =
                calculation.RefundAmount,

            RefundStatus =
                "PENDING",

            RefundDate =
                DateTime.UtcNow
        };

        var created =
            await _refundRepository.CreateAsync(refund);

        return MapToResponse(created);
    }


    // =========================================================
    // PROCESS REFUND
    // =========================================================

    public async Task<RefundResponse?> ProcessAsync(int refundId, CancellationToken cancellationToken = default)
    {
        var refund =
            await _refundRepository.GetByIdAsync(
                refundId);

        if (refund == null)
            throw new KeyNotFoundException(
                $"Refund {refundId} not found.");

        // ------------------------------------------
        // 1. Already processed
        // ------------------------------------------

        if (refund.RefundStatus == "PROCESSED")
        {
            return MapToResponse(refund);
        }

        // ------------------------------------------
        // 2. Validate amount
        // ------------------------------------------

        if (!refund.RefundAmount.HasValue ||
            refund.RefundAmount <= 0)
        {
            throw new InvalidOperationException(
                "Refund amount must be greater than zero.");
        }

        // ------------------------------------------
        // 3. Load original payment
        // ------------------------------------------

        var payment =
            await _paymentRepository.GetByIdAsync(
                refund.PaymentId);

        if (payment == null)
        {
            await _refundRepository.UpdateStatusAsync(
                refundId,
                "FAILED",
                "Original payment not found.");

            return await GetByIdAsync(refundId);
        }

        // ------------------------------------------
        // 4. Validate original payment
        // ------------------------------------------

        if (payment.Status != "PAID")
        {
            await _refundRepository.UpdateStatusAsync(
                refundId,
                "FAILED",
                "Original payment is not PAID.");

            return await GetByIdAsync(refundId);
        }

        if (string.IsNullOrWhiteSpace(
            payment.TransactionId))
        {
            await _refundRepository.UpdateStatusAsync(
                refundId,
                "FAILED",
                "Original payment transaction ID is missing.");

            return await GetByIdAsync(refundId);
        }

        // ------------------------------------------
        // 5. Mark PROCESSING
        // ------------------------------------------

        refund.RefundStatus = "PROCESSING";

        await _refundRepository.UpdateAsync(
            refund);

        // ------------------------------------------
        // 6. Call payment gateway
        // ------------------------------------------

        var gatewayRequest =
            new RefundGatewayRequest
            {
                OriginalTransactionId =
                    payment.TransactionId,

                Amount =
                    refund.RefundAmount.Value,

                IdempotencyKey =
                    refund.IdempotencyKey
            };

        RefundGatewayResult result;

        try
        {
            result =
                await _paymentGateway.RefundAsync(
                    gatewayRequest,
                    cancellationToken);
        }
        catch (OperationCanceledException)
        {
            // Không tự động FAILED.
            //
            // Vì cancellation của application
            // không chứng minh gateway chưa xử lý.

            await _refundRepository.UpdateStatusAsync(
                refundId,
                "UNKNOWN",
                "Refund request was cancelled.");

            throw;
        }
        catch (Exception ex)
        {
            await _refundRepository.UpdateStatusAsync(
                refundId,
                "UNKNOWN",
                ex.Message);

            throw;
        }

        // ------------------------------------------
        // 7. Gateway UNKNOWN
        // ------------------------------------------

        if (result.IsUnknown)
        {
            refund.RefundStatus = "UNKNOWN";
            refund.FailureReason =
                result.ErrorMessage;

            refund.RetryCount++;

            await _refundRepository.UpdateAsync(
                refund);

            return MapToResponse(refund);
        }

        // ------------------------------------------
        // 8. Gateway FAILED
        // ------------------------------------------

        if (result.IsFailure)
        {
            refund.RefundStatus = "FAILED";
            refund.FailureReason =
                result.ErrorMessage;

            refund.RetryCount++;

            await _refundRepository.UpdateAsync(
                refund);

            return MapToResponse(refund);
        }

        // ------------------------------------------
        // 9. Gateway SUCCESS
        // ------------------------------------------

        if (result.IsSuccess)
        {
            refund.RefundStatus =
                "PROCESSED";

            refund.RefundTransactionId =
                result.RefundTransactionId;

            refund.ProcessedAt =
                DateTime.UtcNow;

            refund.RefundDate =
                DateTime.UtcNow;

            refund.FailureReason = null;

            await _refundRepository.UpdateAsync(
                refund);

            // --------------------------------------
            // IMPORTANT
            // Ticket + Seat sẽ được xử lý tiếp
            // trong application transaction.
            // --------------------------------------

            return MapToResponse(refund);
        }

        // ------------------------------------------
        // 10. Safety fallback
        // ------------------------------------------

        refund.RefundStatus = "UNKNOWN";

        refund.FailureReason =
            "Unknown gateway response.";

        refund.RetryCount++;

        await _refundRepository.UpdateAsync(
            refund);

        return MapToResponse(refund);
    }

    // =========================================================
    // MARK REFUND FAILED
    // =========================================================

    public async Task<bool> MarkAsFailedAsync(int refundId, string reason)
    {
        if (refundId <= 0)
        {
            throw new ArgumentException(
                "Refund ID must be greater than 0.",
                nameof(refundId));
        }

        var refund =
            await _refundRepository
                .GetByIdAsync(refundId);

        if (refund == null)
        {
            throw new KeyNotFoundException($"Refund {refundId} not found.");
        }

        if (refund.RefundStatus ==
            RefundStatus.Processed)
        {
            throw new InvalidOperationException(
                "A processed refund cannot be marked as failed.");
        }

        refund.RefundStatus =
           "FAILED";
        refund.FailureReason = reason;

        refund.RetryCount++;

        refund.RefundDate = DateTime.UtcNow;

        await _refundRepository.UpdateAsync(refund);
        return MapToResponse(refund) != null;
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool>
        DeleteAsync(int id)
    {
        var refund =
           await _refundRepository.GetByIdAsync(id);

        if (refund == null)
            return false;

        // Do not delete processed refunds
        if (refund.RefundStatus == "PROCESSED")
        {
            throw new InvalidOperationException(
                "Processed refund cannot be deleted.");
        }

        return await _refundRepository.DeleteAsync(id);
    }

    // =========================================================
    // MAPPING
    // =========================================================

    private static RefundResponse
        MapToResponse(Refund r)
    {
        return new RefundResponse
        {
            Id =
                r.Id,

            TicketId =
                r.TicketId,

            CancellationRuleId =
                r.CancellationRuleId,

            AmountPaid =
                r.AmountPaid,

            CancellationFee =
                r.CancellationFee,

            RefundAmount =
                r.RefundAmount,

            RefundStatus =
                r.RefundStatus,

            RefundDate =
                r.RefundDate
        };
    }
}