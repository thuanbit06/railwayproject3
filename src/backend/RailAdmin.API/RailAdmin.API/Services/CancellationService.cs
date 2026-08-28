namespace RailAdmin.API.Services;
using global::RailAdmin.API.DTOs.Request.CancellationRule;
using global::RailAdmin.API.DTOs.Response;
using global::RailAdmin.API.Models;
using global::RailAdmin.API.Repository.IRepository;
using global::RailAdmin.API.Services.IService;

public class CancellationService : ICancellationService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly ICancellationRuleService _ruleService;
    private readonly IRefundService _refundService;
    private readonly ISeatService _seatService;

    public CancellationService(
        ITicketRepository ticketRepository,
        ICancellationRuleService ruleService,
        IRefundService refundService,
        ISeatService seatService)
    {
        _ticketRepository = ticketRepository;
        _ruleService = ruleService;
        _refundService = refundService;
        _seatService = seatService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<CancellationCalculationResponse>>
        GetAllAsync()
    {
        // Cancellation is a transaction/workflow rather
        // than a standalone database table.
        //
        // Therefore, this method can return cancellation
        // calculations for tickets that are already cancelled.

        var tickets =
            await _ticketRepository.GetAllAsync();

        var result =
            new List<CancellationCalculationResponse>();

        foreach (var ticket in tickets)
        {
            if (!ticket.CancelledAt.HasValue)
            {
                continue;
            }

            try
            {
                var calculation =
                    await CalculateCancellationAsync(
                        ticket.Id);

                result.Add(calculation);
            }
            catch
            {
                // Ignore tickets that cannot be calculated
                // because related trip/rule data is missing.
            }
        }

        return result;
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<CancellationCalculationResponse?>
        GetByIdAsync(int ticketId)
    {
        var ticket =
            await _ticketRepository
                .GetByIdWithBookingAsync(ticketId);

        if (ticket == null)
        {
            return null;
        }

        return await CalculateCancellationAsync(
            ticketId);
    }

    // =========================================================
    // CREATE
    //
    // Preview cancellation calculation
    // =========================================================

    public async Task<CancellationCalculationResponse>
        CreateAsync(
            CancellationRequest dto)
    {
        return await CalculateCancellationAsync(
            dto.TicketId);
    }

    // =========================================================
    // UPDATE
    //
    // Actual cancellation operation
    // =========================================================

    public async Task<bool>
        UpdateAsync(
            int ticketId,
            CancellationRequest dto)
    {
        if (ticketId != dto.TicketId)
        {
            throw new ArgumentException(
                "Ticket ID does not match request.");
        }

        await CancelTicketAsync(dto);

        return true;
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool>
        DeleteAsync(int ticketId)
    {
        // Cancellation should normally NOT be deleted.
        //
        // Cancellation is a business/audit event.
        //
        // Keep the method only because your requested
        // service contract contains DeleteAsync.

        throw new InvalidOperationException(
            "Cancellation records should not be deleted.");
    }

    // =========================================================
    // GET APPLICABLE RULE
    // =========================================================

    public async Task<CancellationRuleResponse?>
        GetApplicableRuleAsync(
            int hoursBeforeDeparture)
    {
        return await _ruleService
            .GetApplicableRuleAsync(
                hoursBeforeDeparture);
    }

    // =========================================================
    // CALCULATE CANCELLATION
    // =========================================================

    public async Task<CancellationCalculationResponse>
        CalculateCancellationAsync(
            int ticketId)
    {
        // -----------------------------------------------------
        // 1. Load Ticket
        // -----------------------------------------------------

        var ticket =
            await _ticketRepository
                .GetByIdWithBookingAsync(ticketId);

        if (ticket == null)
        {
            throw new KeyNotFoundException(
                $"Ticket {ticketId} not found.");
        }

        // -----------------------------------------------------
        // 2. Check Ticket Status
        // -----------------------------------------------------

        if (IsAlreadyCancelled(ticket))
        {
            throw new InvalidOperationException(
                $"Ticket {ticketId} has already been cancelled.");
        }

        if (!ticket.Status.Equals(
                "CONFIRMED",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                $"Ticket {ticketId} cannot be cancelled " +
                $"because its status is '{ticket.Status}'.");
        }

        // -----------------------------------------------------
        // 3. Load Trip
        // -----------------------------------------------------

        var trip =
            ticket.Booking?.Trip;

        if (trip == null)
        {
            throw new InvalidOperationException(
                $"Trip information for ticket " +
                $"{ticketId} could not be found.");
        }

        // -----------------------------------------------------
        // 4. Check DepartureTime
        // -----------------------------------------------------

        var departureDateTime =
            trip.JourneyDate.Date
            .Add(trip.DepartureTime);

        var cancellationTime =
            DateTime.UtcNow;

        // -----------------------------------------------------
        // 5. Calculate Δt
        // -----------------------------------------------------

        var remaining =
            departureDateTime -
            cancellationTime;

        var hoursBeforeDeparture =
            (int)Math.Floor(
                remaining.TotalHours);

        if (hoursBeforeDeparture < 0)
        {
            hoursBeforeDeparture = 0;
        }

        // -----------------------------------------------------
        // 6-9. Rule + Fee + Refund
        // -----------------------------------------------------

        return await _ruleService
            .CalculateCancellationAsync(
                ticket.Fare,
                hoursBeforeDeparture);
    }

    // =========================================================
    // CHECK CANCELLATION
    // =========================================================

    public async Task<bool>
        IsCancellationAllowedAsync(
            int ticketId)
    {
        var ticket =
            await _ticketRepository
                .GetByIdWithBookingAsync(ticketId);

        if (ticket == null)
        {
            return false;
        }

        if (IsAlreadyCancelled(ticket))
        {
            return false;
        }

        if (!ticket.Status.Equals(
                "CONFIRMED",
                StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        var trip =
            ticket.Booking?.Trip;

        if (trip == null)
        {
            return false;
        }

        var departureDateTime =
            trip.JourneyDate.Date
            .Add(trip.DepartureTime);

        var remaining =
            departureDateTime -
            DateTime.UtcNow;

        var hours =
            (int)Math.Floor(
                remaining.TotalHours);

        return await _ruleService
            .IsCancellationAllowedAsync(
                Math.Max(hours, 0));
    }

    // =========================================================
    // CANCEL TICKET
    // =========================================================

    public async Task<CancellationCalculationResponse>
        CancelTicketAsync(
            CancellationRequest dto)
    {
        // -----------------------------------------------------
        // 1. Load Ticket
        // -----------------------------------------------------

        var ticket =
            await _ticketRepository
                .GetByIdWithBookingAsync(
                    dto.TicketId);

        if (ticket == null)
        {
            throw new KeyNotFoundException(
                $"Ticket {dto.TicketId} not found.");
        }

        // -----------------------------------------------------
        // 2. Check Ticket Status
        // -----------------------------------------------------

        if (IsAlreadyCancelled(ticket))
        {
            throw new InvalidOperationException(
                $"Ticket {ticket.Id} has already been cancelled.");
        }

        if (!ticket.Status.Equals(
                "CONFIRMED",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                $"Ticket {ticket.Id} cannot be cancelled " +
                $"from status '{ticket.Status}'.");
        }

        // -----------------------------------------------------
        // 3. Load Trip
        // -----------------------------------------------------

        var trip =
            ticket.Booking?.Trip;

        if (trip == null)
        {
            throw new InvalidOperationException(
                "Trip information could not be found.");
        }

        // -----------------------------------------------------
        // 4. Check DepartureTime
        // -----------------------------------------------------

        var departureDateTime =
            trip.JourneyDate.Date
            .Add(trip.DepartureTime);

        var cancellationTime =
            DateTime.UtcNow;

        if (departureDateTime <= cancellationTime)
        {
            throw new InvalidOperationException(
                "The train has already departed.");
        }

        // -----------------------------------------------------
        // 5. Calculate Δt
        // -----------------------------------------------------

        var remaining =
            departureDateTime -
            cancellationTime;

        var hoursBeforeDeparture =
            (int)Math.Floor(
                remaining.TotalHours);

        // -----------------------------------------------------
        // 6-9. Find Rule + Calculate Fee + Refund
        // -----------------------------------------------------

        var calculation =
            await _ruleService
                .CalculateCancellationAsync(
                    ticket.Fare,
                    hoursBeforeDeparture);

        // -----------------------------------------------------
        // 7. Check cancellation allowed
        // -----------------------------------------------------

        if (!calculation.IsCancellationAllowed)
        {
            throw new InvalidOperationException(
                calculation.Message);
        }

        // -----------------------------------------------------
        // 10. Create Refund PENDING
        // -----------------------------------------------------

        var refund =
            await _refundService
                .CreateFromCalculationAsync(
                    ticket.Id,
                    calculation.CancellationRuleId,
                    ticket.Fare,
                    calculation.CancellationFee,
                    calculation.RefundAmount);

        // -----------------------------------------------------
        // 11. Change Ticket → CANCELLED
        // -----------------------------------------------------

        ticket.Status = "CANCELLED";

        ticket.CancelReason =
            dto.CancelReason;

        ticket.CancelledAt =
            cancellationTime;

        var ticketUpdated =
            await _ticketRepository
                .UpdateAsync(ticket);

        if (!ticketUpdated)
        {
            throw new InvalidOperationException(
                $"Failed to cancel ticket {ticket.Id}.");
        }

        // -----------------------------------------------------
        // 12. Release Seat
        // -----------------------------------------------------

        if (ticket.SeatId.HasValue)
        {
            await ReleaseSeatAsync(
                ticket.SeatId.Value);
        }

        // -----------------------------------------------------
        // 13. Trigger Payment Refund
        // -----------------------------------------------------

        try
        {
            // -------------------------------------------------
            // 14. Refund → PROCESSED
            // -------------------------------------------------

            await _refundService
                .ProcessAsync(refund.Id);
        }
        catch
        {
            // RefundService has already changed
            // refund status to FAILED.
            //
            // Ticket remains CANCELLED.
            //
            // This allows retrying the refund later.

            throw;
        }

        return calculation;
    }

    // =========================================================
    // RELEASE SEAT
    // =========================================================

    private async Task ReleaseSeatAsync(
        int seatId)
    {
        // TODO:
        //
        // This should eventually be moved to:
        //
        // ISeatService
        //
        // Example:
        //
        // await _seatService.ReleaseAsync(seatId);
        //
        // For now this is the place where the seat
        // release operation belongs.

        await Task.CompletedTask;
    }

    // =========================================================
    // HELPERS
    // =========================================================

    private static bool IsAlreadyCancelled(
        Ticket ticket)
    {
        return ticket.Status.Equals(
                   "CANCELLED",
                   StringComparison.OrdinalIgnoreCase)
               ||
               ticket.CancelledAt.HasValue;
    }
}
