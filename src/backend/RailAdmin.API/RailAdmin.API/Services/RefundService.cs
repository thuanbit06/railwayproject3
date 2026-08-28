using RailAdmin.API.Data.Constants;
using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class RefundService : IRefundService
{
    private readonly IRefundRepository _refundRepository;

    public RefundService(
        IRefundRepository refundRepository)
    {
        _refundRepository = refundRepository;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<RefundResponse>>
        GetAllAsync()
    {
        var refunds =
            await _refundRepository.GetAllAsync();

        return refunds.Select(MapToResponse);
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
                .ExistsForTicketAsync(dto.TicketId);

        if (alreadyExists)
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

        throw new NotImplementedException(
            "CreateAsync should receive the " +
            "calculated cancellation result from " +
            "CancellationRuleService.");
    }

    // =========================================================
    // CREATE REFUND FROM CALCULATION
    // =========================================================

    public async Task<RefundResponse>
        CreateFromCalculationAsync(
            int ticketId,
            int? cancellationRuleId,
            decimal amountPaid,
            decimal cancellationFee,
            decimal refundAmount)
    {
        if (ticketId <= 0)
        {
            throw new ArgumentException(
                "Ticket ID must be greater than 0.",
                nameof(ticketId));
        }

        if (amountPaid < 0)
        {
            throw new ArgumentException(
                "Amount paid cannot be negative.");
        }

        if (cancellationFee < 0)
        {
            throw new ArgumentException(
                "Cancellation fee cannot be negative.");
        }

        if (refundAmount < 0)
        {
            throw new ArgumentException(
                "Refund amount cannot be negative.");
        }

        // -----------------------------------------------------
        // Prevent duplicate refund
        // -----------------------------------------------------

        var exists =
            await _refundRepository
                .ExistsForTicketAsync(ticketId);

        if (exists)
        {
            throw new InvalidOperationException(
                $"A refund already exists for " +
                $"ticket {ticketId}.");
        }

        // -----------------------------------------------------
        // Business consistency validation
        // -----------------------------------------------------

        var expectedRefund = Math.Max(amountPaid - cancellationFee, 0);
          
        if (expectedRefund < 0)
        {
            expectedRefund = 0;
        }

        expectedRefund =
            Math.Round(
                expectedRefund,
                2,
                MidpointRounding.AwayFromZero);

        if (refundAmount != expectedRefund)
        {
            throw new InvalidOperationException(
                "Refund amount does not match " +
                "the cancellation calculation.");
        }

        // -----------------------------------------------------
        // Create PENDING refund
        // -----------------------------------------------------

        var refund = new Refund
        {
            TicketId = ticketId,

            CancellationRuleId =
                cancellationRuleId,

            AmountPaid =
                amountPaid,

            CancellationFee =
                cancellationFee,

            RefundAmount =
                refundAmount,

            RefundStatus =
                RefundStatus.Pending,

            RefundDate =
                DateTime.UtcNow
        };

        var created =
            await _refundRepository
                .CreateAsync(refund);

        return MapToResponse(created);
    }

    // =========================================================
    // PROCESS REFUND
    // =========================================================

    public async Task<RefundResponse>
        ProcessAsync(int refundId)
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
            throw new KeyNotFoundException(
                $"Refund {refundId} not found.");
        }

        // -----------------------------------------------------
        // Idempotency
        // -----------------------------------------------------

        if (refund.RefundStatus ==
            RefundStatus.Processed)
        {
            return MapToResponse(refund);
        }

        if (refund.RefundStatus !=
            RefundStatus.Pending)
        {
            throw new InvalidOperationException(
                $"Refund {refundId} cannot be processed " +
                $"because its current status is " +
                $"'{refund.RefundStatus}'.");
        }

        try
        {
            // -------------------------------------------------
            // TODO:
            //
            // Call PaymentService / Payment Gateway here.
            //
            // Example:
            //
            // await _paymentService.RefundAsync(
            //     refund.TicketId,
            //     refund.RefundAmount);
            // -------------------------------------------------

            var success = true;

            if (!success)
            {
                await _refundRepository
                    .UpdateStatusAsync(
                        refundId,
                        RefundStatus.Failed);

                throw new InvalidOperationException(
                    "Payment gateway rejected refund.");
            }

            await _refundRepository
                .UpdateStatusAsync(
                    refundId,
                    RefundStatus.Processed);
        }
        catch
        {
            await _refundRepository
                .UpdateStatusAsync(
                    refundId,
                    RefundStatus.Failed);

            throw;
        }

        var updated =
            await _refundRepository
                .GetByIdAsync(refundId);

        return MapToResponse(updated!);
    }

    // =========================================================
    // MARK REFUND FAILED
    // =========================================================

    public async Task<bool>
        MarkAsFailedAsync(int refundId)
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
            return false;
        }

        if (refund.RefundStatus ==
            RefundStatus.Processed)
        {
            throw new InvalidOperationException(
                "A processed refund cannot be marked as failed.");
        }

        return await _refundRepository
            .UpdateStatusAsync(
                refundId,
                RefundStatus.Failed);
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool>
        DeleteAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Refund ID must be greater than 0.",
                nameof(id));
        }

        return await _refundRepository
            .DeleteAsync(id);
    }

    // =========================================================
    // MAPPING
    // =========================================================

    private static RefundResponse
        MapToResponse(Refund r)
    {
        return new RefundResponse
        {
            Id = r.Id,

            TicketId = r.TicketId,

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