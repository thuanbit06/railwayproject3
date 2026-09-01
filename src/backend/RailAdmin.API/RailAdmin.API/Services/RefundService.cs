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
    private readonly ISeatService _seatService;
    private readonly ITicketRepository _ticketRepository;

    public RefundService(
        IRefundRepository refundRepository,
        ITicketRepository ticketRepository,
        ISeatService seatService)
    {
        _refundRepository = refundRepository;
        _ticketRepository = ticketRepository;
        _seatService = seatService;
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

            RefundAmount = refundAmount,

            RefundStatus = "PENDING",

            RefundDate = DateTime.UtcNow
        };

        var created = await _refundRepository.CreateAsync(refund);

        return MapToResponse(created);
    }


    // =========================================================
    // PROCESS REFUND
    // =========================================================

    public async Task<RefundResponse> ProcessAsync(int refundId)
    {
        if (refundId <= 0)
        {
            throw new ArgumentException(
                "Refund ID must be greater than 0.",
                nameof(refundId));
        }

        var refund =
            await _refundRepository.GetByIdAsync(
                refundId);

        if (refund == null)
        {
            throw new KeyNotFoundException(
                $"Refund with ID {refundId} was not found.");
        }

        if (refund.RefundStatus != "PENDING")
        {
            throw new InvalidOperationException(
                $"Refund {refundId} is already " +
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

            bool paymentSuccess = true;

            if (!paymentSuccess)
            {
                await MarkAsFailedAsync(refundId);

                throw new InvalidOperationException(
                    $"Refund {refundId} payment failed.");
            }

            // -------------------------------------------------
            // Payment succeeded
            // -------------------------------------------------

            refund.RefundStatus =
                "PROCESSED";

            refund.RefundDate =
                DateTime.UtcNow;

            await _refundRepository.UpdateAsync(
                refund);

            // -------------------------------------------------
            // Ticket → CANCELLED
            // -------------------------------------------------

            await _ticketRepository.CancelAsync(
                refund.TicketId,
                "Customer requested cancellation.",
                refund.RefundDate);

            // -------------------------------------------------
            // Release Seat
            // -------------------------------------------------

            var ticket =
                await _ticketRepository.GetByIdAsync(
                    refund.TicketId);

            if (ticket?.SeatId != null)
            {
                await _seatService.ReleaseAsync(
                    ticket.SeatId.Value,
                    refund.TicketId);
            }

            return MapToResponse(refund);
        }
        catch
        {
            await _refundRepository.UpdateStatusAsync(
                refundId,
                RefundStatus.Failed);

            throw;
        }
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

        refund.RefundStatus =
           "FAILED";

        refund.RefundDate =
         DateTime.UtcNow;

        return await _refundRepository.UpdateAsync(refund);
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

public async Task<bool> UpdateAsync(
    int id,
    RefundUpdateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (id <= 0)
        {
            throw new ArgumentException(
                "Refund ID must be greater than 0.",
                nameof(id));
        }

        if (string.IsNullOrWhiteSpace(dto.RefundStatus))
        {
            throw new ArgumentException(
                "Refund status is required.",
                nameof(dto.RefundStatus));
        }

        var refund = await _refundRepository
            .GetByIdAsync(id);

        if (refund == null)
        {
            return false;
        }

        return await _refundRepository
            .UpdateStatusAsync(
                id,
                dto.RefundStatus.Trim());
    }
}