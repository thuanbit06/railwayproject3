using RailAdmin.API;
using RailAdmin.API.Data.Constant;
using RailAdmin.API.DTOs.Request.CancellationRule;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class CancellationRuleService
    : ICancellationRuleService
{
    private readonly ICancellationRuleRepository
        _cancellationRuleRepository;

    public CancellationRuleService(
        ICancellationRuleRepository cancellationRuleRepository)
    {
        _cancellationRuleRepository =
            cancellationRuleRepository;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<CancellationRuleResponse>>
        GetAllAsync()
    {
        var rules =
            await _cancellationRuleRepository.GetAllAsync();

        return rules.Select(MapToResponse);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<CancellationRuleResponse?>
        GetByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Rule ID must be greater than 0.",
                nameof(id));
        }

        var rule =
            await _cancellationRuleRepository.GetByIdAsync(id);

        return rule == null
            ? null
            : MapToResponse(rule);
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<CancellationRuleResponse>
        CreateAsync(
            CancellationRuleCreateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        ValidateRule(dto);

        var exists =
            await _cancellationRuleRepository
                .ExistsAtHoursAsync(
                    dto.HoursBeforeDeparture);

        if (exists)
        {
            throw new InvalidOperationException(
                $"A cancellation rule already exists " +
                $"for {dto.HoursBeforeDeparture} hours " +
                $"before departure.");
        }

        var rule = new CancellationRule
        {
            HoursBeforeDeparture =
                dto.HoursBeforeDeparture,

            FeeType =
                dto.FeeType.Trim().ToUpperInvariant(),

            FeeValue =
                dto.FeeValue,

            MinFee =
                dto.MinFee
        };

        var created =
            await _cancellationRuleRepository
                .CreateAsync(rule);

        return MapToResponse(created);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<bool> UpdateAsync(
        int id,
        CancellationRuleUpdateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (id <= 0)
        {
            throw new ArgumentException(
                "Rule ID must be greater than 0.",
                nameof(id));
        }

        ValidateRule(dto);

        var existing =
            await _cancellationRuleRepository
                .GetByIdAsync(id);

        if (existing == null)
        {
            return false;
        }

        var duplicate =
            await _cancellationRuleRepository
                .ExistsAtHoursAsync(
                    dto.HoursBeforeDeparture,
                    id);

        if (duplicate)
        {
            throw new InvalidOperationException(
                $"Another cancellation rule already exists " +
                $"for {dto.HoursBeforeDeparture} hours " +
                $"before departure.");
        }

        var rule = new CancellationRule
        {
            Id = id,

            HoursBeforeDeparture =
                dto.HoursBeforeDeparture,

            FeeType =
                dto.FeeType.Trim().ToUpperInvariant(),

            FeeValue =
                dto.FeeValue,

            MinFee =
                dto.MinFee
        };

        return await _cancellationRuleRepository
            .UpdateAsync(rule);
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Rule ID must be greater than 0.",
                nameof(id));
        }

        var existing =
            await _cancellationRuleRepository
                .GetByIdAsync(id);

        if (existing == null)
        {
            return false;
        }

        return await _cancellationRuleRepository
            .DeleteAsync(id);
    }

    // =========================================================
    // GET APPLICABLE RULE
    // =========================================================

    public async Task<CancellationRuleResponse?>
        GetApplicableRuleAsync(
            int hoursBeforeDeparture)
    {
        if (hoursBeforeDeparture < 0)
        {
            throw new ArgumentException(
                "Hours before departure cannot be negative.",
                nameof(hoursBeforeDeparture));
        }

        var rule =
            await _cancellationRuleRepository
                .GetApplicableRuleAsync(
                    hoursBeforeDeparture);

        return rule == null
            ? null
            : MapToResponse(rule);
    }

    // =========================================================
    // CHECK WHETHER CANCELLATION IS ALLOWED
    // =========================================================

    public async Task<bool>
        IsCancellationAllowedAsync(
            DateTime departureTime)
    {
        var now = DateTime.UtcNow;

        if (departureTime <= now)
        {
            return false;
        }

        var hours =
            CalculateHoursBeforeDeparture(
                now,
                departureTime);

        var rule =
            await _cancellationRuleRepository
                .GetApplicableRuleAsync(hours);

        return rule != null;
    }

    // =========================================================
    // CALCULATE CANCELLATION
    // =========================================================

    public async Task<CancellationCalculationResponse>
        CalculateCancellationAsync(
            int ticketId,
            string pnr,
            decimal amountPaid,
            DateTime departureTime)
    {
        if (ticketId <= 0)
        {
            throw new ArgumentException(
                "Ticket ID must be greater than 0.",
                nameof(ticketId));
        }

        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));
        }

        if (amountPaid < 0)
        {
            throw new ArgumentException(
                "Amount paid cannot be negative.",
                nameof(amountPaid));
        }

        var now = DateTime.UtcNow;

        if (departureTime <= now)
        {
            return new CancellationCalculationResponse
            {
                TicketId = ticketId,
                PNR = pnr,
                AmountPaid = amountPaid,
                HoursBeforeDeparture = 0,
                CancellationAllowed = false,
                CancellationFee = 0,
                RefundAmount = 0,
                Message =
                    "Cancellation is not allowed after departure."
            };
        }

        var hoursBeforeDeparture =
            CalculateHoursBeforeDeparture(
                now,
                departureTime);

        var rule =
            await _cancellationRuleRepository
                .GetApplicableRuleAsync(
                    hoursBeforeDeparture);

        if (rule == null)
        {
            return new CancellationCalculationResponse
            {
                TicketId = ticketId,
                PNR = pnr,
                AmountPaid = amountPaid,
                HoursBeforeDeparture =
                    hoursBeforeDeparture,

                CancellationAllowed = false,

                CancellationFee = 0,

                RefundAmount = 0,

                Message =
                    "No cancellation rule applies " +
                    "for the current departure time."
            };
        }

        var cancellationFee =
            CalculateCancellationFee(
                amountPaid,
                rule);

        cancellationFee =
            Math.Min(
                cancellationFee,
                amountPaid);

        var refundAmount =
            amountPaid - cancellationFee;

        return new CancellationCalculationResponse
        {
            TicketId = ticketId,

            PNR = pnr,

            AmountPaid = amountPaid,

            HoursBeforeDeparture =
                hoursBeforeDeparture,

            CancellationRuleId =
                rule.Id,

            FeeType =
                rule.FeeType,

            FeeValue =
                rule.FeeValue,

            CancellationFee =
                cancellationFee,

            RefundAmount =
                refundAmount,

            CancellationAllowed = true,

            Message =
                "Cancellation is allowed."
        };
    }

    // =========================================================
    // CALCULATE FEE
    // =========================================================

    private static decimal CalculateCancellationFee(
        decimal amountPaid,
        CancellationRule rule)
    {
        decimal fee;

        switch (rule.FeeType.ToUpperInvariant())
        {
            case CancellationFeeType.Percentage:

                fee =
                    amountPaid *
                    rule.FeeValue /
                    100m;

                break;

            case CancellationFeeType.Flat:

                fee =
                    rule.FeeValue;

                break;

            default:

                throw new InvalidOperationException(
                    $"Unsupported cancellation fee type: " +
                    $"{rule.FeeType}");
        }

        // Apply minimum fee
        if (fee < rule.MinFee)
        {
            fee = rule.MinFee;
        }

        return Math.Round(
            fee,
            2,
            MidpointRounding.AwayFromZero);
    }

    // =========================================================
    // CALCULATE HOURS
    // =========================================================

    private static int CalculateHoursBeforeDeparture(
        DateTime currentTime,
        DateTime departureTime)
    {
        var hours =
            (departureTime - currentTime)
            .TotalHours;

        return Math.Max(
            0,
            (int)Math.Floor(hours));
    }

    // =========================================================
    // VALIDATE RULE
    // =========================================================

    private static void ValidateRule(
        CancellationRuleCreateRequest dto)
    {
        if (dto.HoursBeforeDeparture < 0)
        {
            throw new ArgumentException(
                "Hours before departure cannot be negative.");
        }

        if (dto.HoursBeforeDeparture > 1000)
        {
            throw new ArgumentException(
                "Hours before departure cannot exceed 1000.");
        }

        if (string.IsNullOrWhiteSpace(dto.FeeType))
        {
            throw new ArgumentException(
                "Fee type is required.");
        }

        var feeType =
            dto.FeeType
                .Trim()
                .ToUpperInvariant();

        if (feeType != CancellationFeeType.Percentage &&
            feeType != CancellationFeeType.Flat)
        {
            throw new ArgumentException(
                "Fee type must be PERCENTAGE or FLAT.");
        }

        if (dto.FeeValue < 0)
        {
            throw new ArgumentException(
                "Fee value cannot be negative.");
        }

        if (dto.MinFee < 0)
        {
            throw new ArgumentException(
                "Minimum fee cannot be negative.");
        }

        if (feeType ==
            CancellationFeeType.Percentage &&
            dto.FeeValue > 100)
        {
            throw new ArgumentException(
                "Percentage fee cannot exceed 100%.");
        }
    }

    private static void ValidateRule(
        CancellationRuleUpdateRequest dto)
    {
        if (dto.HoursBeforeDeparture < 0)
        {
            throw new ArgumentException(
                "Hours before departure cannot be negative.");
        }

        if (dto.HoursBeforeDeparture > 1000)
        {
            throw new ArgumentException(
                "Hours before departure cannot exceed 1000.");
        }

        if (string.IsNullOrWhiteSpace(dto.FeeType))
        {
            throw new ArgumentException(
                "Fee type is required.");
        }

        var feeType =
            dto.FeeType
                .Trim()
                .ToUpperInvariant();

        if (feeType != CancellationFeeType.Percentage &&
            feeType != CancellationFeeType.Flat)
        {
            throw new ArgumentException(
                "Fee type must be PERCENTAGE or FLAT.");
        }

        if (dto.FeeValue < 0)
        {
            throw new ArgumentException(
                "Fee value cannot be negative.");
        }

        if (dto.MinFee < 0)
        {
            throw new ArgumentException(
                "Minimum fee cannot be negative.");
        }

        if (feeType ==
            CancellationFeeType.Percentage &&
            dto.FeeValue > 100)
        {
            throw new ArgumentException(
                "Percentage fee cannot exceed 100%.");
        }
    }

    // =========================================================
    // MAPPING
    // =========================================================

    private static CancellationRuleResponse
        MapToResponse(
            CancellationRule rule)
    {
        return new CancellationRuleResponse
        {
            Id = rule.Id,

            HoursBeforeDeparture =
                rule.HoursBeforeDeparture,

            FeeType =
                rule.FeeType,

            FeeValue =
                rule.FeeValue,

            MinFee =
                rule.MinFee
        };
    }
}