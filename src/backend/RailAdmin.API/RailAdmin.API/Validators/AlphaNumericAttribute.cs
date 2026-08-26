using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.Validators;

public class AlphaNumericAttribute : ValidationAttribute
{
    protected override ValidationResult? IsValid(object? value, ValidationContext context)
    {
        if (value is not string password)
            return ValidationResult.Success;

        var hasLetter = password.Any(char.IsLetter);
        var hasDigit = password.Any(char.IsDigit);

        if (!hasLetter || !hasDigit)
            return new ValidationResult(
                ErrorMessage ?? "Mật khẩu phải chứa ít nhất 1 chữ cái và 1 chữ số."
            );

        return ValidationResult.Success;
    }
}