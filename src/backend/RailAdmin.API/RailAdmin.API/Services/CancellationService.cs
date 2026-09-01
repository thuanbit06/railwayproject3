namespace RailAdmin.API.Services;
using global::RailAdmin.API.DTOs.Request.CancellationRule;
using global::RailAdmin.API.DTOs.Response;
using global::RailAdmin.API.Models;
using global::RailAdmin.API.Repository.IRepository;
using global::RailAdmin.API.Services.IService;
using RailAdmin.API.Repository;

public class CancellationService : ICancellationService
{
    private readonly ICancellationRuleRepository _ruleRepository;
    private readonly ITicketService _ticketService;
    private readonly ITripService _tripService;
    private readonly ITicketRepository _ticketRepository;
    private readonly IRefundRepository _refundRepository;

    public CancellationService(
        ICancellationRuleRepository ruleRepository,
        ITicketService ticketService,
        ITripService tripService,
        ITicketRepository ticketRepository,
        IRefundRepository refundRepository
        )
    {
        _ruleRepository = ruleRepository;
        _ticketService = ticketService;
        _tripService = tripService;
        _ticketRepository = ticketRepository;
        _refundRepository = refundRepository;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<CancellationRuleResponse>> GetAllAsync()
    {
        var rules = await _ruleRepository.GetAllAsync();

        return rules
            .OrderByDescending(x => x.HoursBeforeDeparture)
            .Select(MapToResponse);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<CancellationRuleResponse?> GetByIdAsync(int id)
    {
        var rule = await _ruleRepository.GetByIdAsync(id);

        return rule == null
            ? null
            : MapToResponse(rule);
    }

    // =========================================================
    // CREATE
    //
    // Preview cancellation calculation
    // =========================================================

    public async Task<CancellationRuleResponse> CreateAsync(
            CancellationRuleCreateRequest dto)
    {
        ValidateRule(dto.HoursBeforeDeparture,
                     dto.FeeType,
                     dto.FeeValue,
                     dto.MinFee);

        var rule = new CancellationRule
        {
            HoursBeforeDeparture = dto.HoursBeforeDeparture,
            FeeType = dto.FeeType.Trim().ToUpperInvariant(),
            FeeValue = dto.FeeValue,
            MinFee = dto.MinFee
        };

        var created = await _ruleRepository.CreateAsync(rule);

        return MapToResponse(created);
    }

    // =========================================================
    // UPDATE
    //
    // Actual cancellation operation
    // =========================================================

    public async Task<bool> UpdateAsync(
            int id,
            CancellationRuleUpdateRequest dto)
    {
        ValidateRule(dto.HoursBeforeDeparture,
                     dto.FeeType,
                     dto.FeeValue,
                     dto.MinFee);

        var existing = await _ruleRepository.GetByIdAsync(id);

        if (existing == null)
            return false;

        existing.HoursBeforeDeparture =
            dto.HoursBeforeDeparture;

        existing.FeeType =
            dto.FeeType.Trim().ToUpperInvariant();

        existing.FeeValue =
            dto.FeeValue;

        existing.MinFee =
            dto.MinFee;

        return await _ruleRepository.UpdateAsync(existing);
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        var rule = await _ruleRepository.GetByIdAsync(id);

        if (rule == null)
            return false;

        return await _ruleRepository.DeleteAsync(id);
    }

    // =========================================================
    // GET APPLICABLE RULE
    // =========================================================

    public async Task<CancellationRuleResponse?> GetApplicableRuleAsync(
        int ticketId)
    {// 1. Lấy ticket
        var ticket = await _ticketService.GetByIdAsync(ticketId);

        if (ticket == null)
            return null;

        // 2. Chỉ cho phép hủy khi status = Confirmed
        if (!string.Equals(
                ticket.Status,
                "Confirmed",
                StringComparison.OrdinalIgnoreCase))
        {
            return null;
        }

        // 3. Lấy Trip
        var trip = ticket.TripId.HasValue? await _tripService.GetByIdAsync(ticket.TripId.Value) : null;

        if (trip == null)
            return null;

        var now = DateTime.UtcNow;

        var hoursBeforeDeparture = (trip.JourneyDate.Date + trip.DepartureTime - now).TotalHours;


        if (hoursBeforeDeparture < 0)
            return null;

        var rules = await _ruleRepository.GetAllAsync();

        var applicableRule = rules
            .Where(r =>
                r.HoursBeforeDeparture <=
                hoursBeforeDeparture)
            .OrderByDescending(
                r => r.HoursBeforeDeparture)
            .FirstOrDefault();

        return applicableRule == null
            ? null
            : MapToResponse(applicableRule);
    }


    // =========================================================
    // CALCULATE CANCELLATION
    // =========================================================

    public async Task<CancellationCalculationResponse?>
        CalculateCancellationAsync(int ticketId)
    {
        // =====================================================
        // 1. Load Ticket
        // =====================================================

        //var ticket = await _ticketService.GetByIdAsync(ticketId);
        var ticket = await _ticketRepository.GetByIdWithBookingAndTripAsync(ticketId);
        if (ticket == null)
            return null;

        // =====================================================
        // 2. Check Ticket Status
        // =====================================================

        if (!string.Equals(
                ticket.Status,
                "Confirmed",
                StringComparison.OrdinalIgnoreCase))
        {
            return new CancellationCalculationResponse
            {
                TicketId = ticket.Id,
                PNR = ticket.PNR,
                Fare = ticket.Fare,
                CanCancel = false,
                CancellationTime = DateTime.UtcNow,
                RejectReason =
                    $"Ticket status '{ticket.Status}' cannot be cancelled."
            };
        }

        // =====================================================
        // 3. Load Trip
        // =====================================================

        var booking = ticket.Booking;

        if (booking == null)
            throw new ArgumentException(
                "Booking not found.");

        var trip = booking.Trip;

        if (trip == null)
            throw new ArgumentException(
                "Trip not found.");

        // =====================================================
        // 4. Check DepartureTime
        // =====================================================

        var cancellationTime = DateTime.UtcNow;

        var departureTime = trip.JourneyDate.Date + trip.DepartureTime;

        // =====================================================
        // 5. Calculate Δt
        // =====================================================

        var hoursBeforeDeparture = (departureTime - cancellationTime).TotalHours;

        // =====================================================
        // 6. Find CancellationRule
        // =====================================================

        var rules =
            await _ruleRepository.GetAllAsync();

        var applicableRule = rules
            .Where(r =>
                r.HoursBeforeDeparture <=
                hoursBeforeDeparture)
            .OrderByDescending(
                r => r.HoursBeforeDeparture)
            .FirstOrDefault();

        // =====================================================
        // 7. Check cancellation allowed
        // =====================================================

        if (hoursBeforeDeparture < 0)
        {
            return BuildRejectedResult(ticket, departureTime, cancellationTime, hoursBeforeDeparture,
                "Train has already departed.");
        }

        if (applicableRule == null)
        {
            return BuildRejectedResult(ticket, departureTime, cancellationTime, hoursBeforeDeparture,
                "No applicable cancellation rule found.");
        }

        // =====================================================
        // 8. Calculate CancellationFee
        // =====================================================

        decimal cancellationFee;

        if (applicableRule.FeeType
            .Equals(
                "PERCENTAGE",
                StringComparison.OrdinalIgnoreCase))
        {
            cancellationFee =
                ticket.Fare *
                applicableRule.FeeValue /
                100m;
        }
        else if (applicableRule.FeeType
            .Equals(
                "FLAT",
                StringComparison.OrdinalIgnoreCase))
        {
            cancellationFee =
                applicableRule.FeeValue;
        }
        else
        {
            return BuildRejectedResult(
                ticket,
                departureTime,
                cancellationTime,
                hoursBeforeDeparture,
                "Invalid cancellation fee type.");
        }

        // =====================================================
        // Apply minimum fee
        // =====================================================

        cancellationFee =
            Math.Max(
                cancellationFee,
                applicableRule.MinFee);

        // Prevent fee > fare
        cancellationFee =
            Math.Min(
                cancellationFee,
                ticket.Fare);

        // =====================================================
        // 9. Calculate RefundAmount
        // =====================================================

        var refundAmount =
            ticket.Fare -
            cancellationFee;

        return new CancellationCalculationResponse
        {
            TicketId = ticket.Id,
            PNR = ticket.PNR,

            Fare = ticket.Fare,

            DepartureTime = departureTime,

            CancellationTime =
                cancellationTime,

            HoursBeforeDeparture =
                Math.Round(
                    (decimal)hoursBeforeDeparture,
                    2),

            CanCancel = true,

            CancellationRuleId =
                applicableRule.Id,

            FeeType =
                applicableRule.FeeType,

            FeeValue =
                applicableRule.FeeValue,

            MinFee =
                applicableRule.MinFee,

            CancellationFee =
                Math.Round(
                    cancellationFee,
                    2),

            RefundAmount =
                Math.Round(
                    refundAmount,
                    2)
        };
    }


    // =========================================================
    // CHECK CANCELLATION
    // =========================================================

    public async Task<bool> IsCancellationAllowedAsync(
       int ticketId)
    {
        var calculation =
            await CalculateCancellationAsync(ticketId);

        return calculation?.CanCancel == true;
    }

    // =========================================================
    // RELEASE SEAT
    // =========================================================

    // =========================================================
    // PRIVATE METHODS
    // =========================================================

    private static CancellationCalculationResponse
        BuildRejectedResult(
            Ticket ticket,
            DateTime departureTime,
            DateTime cancellationTime,
            double hoursBeforeDeparture,
            string reason)
    {
        return new CancellationCalculationResponse
        {
            TicketId = ticket.Id,

            PNR = ticket.PNR,

            Fare = ticket.Fare,

            DepartureTime = departureTime,

            CancellationTime =
                cancellationTime,

            HoursBeforeDeparture =
                Math.Round(
                    (decimal)hoursBeforeDeparture,
                    2),

            CanCancel = false,

            CancellationFee = 0,

            RefundAmount = 0,

            RejectReason = reason
        };
    }

    private static void ValidateRule(
        int hoursBeforeDeparture,
        string feeType,
        decimal feeValue,
        decimal minFee)
    {
        if (hoursBeforeDeparture < 0)
            throw new ArgumentException(
                "HoursBeforeDeparture cannot be negative.");

        if (feeValue < 0)
            throw new ArgumentException(
                "FeeValue cannot be negative.");

        if (minFee < 0)
            throw new ArgumentException(
                "MinFee cannot be negative.");

        if (!feeType.Equals(
                "PERCENTAGE",
                StringComparison.OrdinalIgnoreCase)
            &&
            !feeType.Equals(
                "FLAT",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "FeeType must be PERCENTAGE or FLAT.");
        }

        if (feeType.Equals(
                "PERCENTAGE",
                StringComparison.OrdinalIgnoreCase)
            &&
            feeValue > 100)
        {
            throw new ArgumentException(
                "Percentage fee cannot exceed 100%.");
        }
    }

    private static CancellationRuleResponse
        MapToResponse(CancellationRule r)
    {
        return new CancellationRuleResponse
        {
            Id = r.Id,

            HoursBeforeDeparture =
                r.HoursBeforeDeparture,

            FeeType =
                r.FeeType,

            FeeValue =
                r.FeeValue,

            MinFee =
                r.MinFee
        };
    }

    // =========================================================
    // CREATE REFUND FROM CALCULATION
    // =========================================================

    public async Task<RefundResponse> CreateFromCalculationAsync(
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
            await CalculateCancellationAsync(
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
            await _refundRepository.CreateAsync(
                refund);

        return new RefundResponse
        {
            Id = created.Id,
            TicketId = created.TicketId,
            CancellationRuleId =
                created.CancellationRuleId,
            AmountPaid = created.AmountPaid,
            CancellationFee =
                created.CancellationFee,
            RefundAmount =
                created.RefundAmount,
            RefundStatus =
                created.RefundStatus,
            RefundDate =
                created.RefundDate
        };
    }
}
