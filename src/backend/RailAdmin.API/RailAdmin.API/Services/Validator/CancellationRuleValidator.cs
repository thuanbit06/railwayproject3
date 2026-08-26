using RailAdmin.API;
using RailAdmin.API.Data.Constant;

namespace RailAdmin.API.Services.Validators;

public static class CancellationRuleValidator
{
    public static void Validate(
        int hoursBeforeDeparture,
        string feeType,
        decimal feeValue,
        decimal minFee)
    {
        if (hoursBeforeDeparture < 0)
        {
            throw new ArgumentException(
                "Hours before departure cannot be negative.");
        }

        if (hoursBeforeDeparture > 1000)
        {
            throw new ArgumentException(
                "Hours before departure cannot exceed 1000.");
        }

        if (string.IsNullOrWhiteSpace(feeType))
        {
            throw new ArgumentException(
                "Fee type is required.");
        }

        feeType =
            feeType.Trim().ToUpperInvariant();

        if (feeType != CancellationFeeType.Percentage &&
            feeType != CancellationFeeType.Flat)
        {
            throw new ArgumentException(
                "Fee type must be PERCENTAGE or FLAT.");    
        }

        if (feeValue < 0)
        {
            throw new ArgumentException(
                "Fee value cannot be negative.");
        }

        if (minFee < 0)
        {
            throw new ArgumentException(
                "Minimum fee cannot be negative.");
        }

        if (feeType == CancellationFeeType.Percentage &&
            feeValue > 100)
        {
            throw new ArgumentException(
                "Percentage fee cannot exceed 100%.");
        }
    }
}