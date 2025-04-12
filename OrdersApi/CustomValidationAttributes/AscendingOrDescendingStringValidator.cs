using OrdersApi.RequestModels;
using System.ComponentModel.DataAnnotations;

namespace OrdersApi.CustomValidationAttributes
{
    public class AscendingOrDescendingStringValidator:ValidationAttribute
    {

        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (value is string req)
            {
                string[] validItems = ["asc", "desc"];

                if (!validItems.Contains(req.ToLower()))
                {
                    return new ValidationResult($"Invalid {nameof(value)}");
                }
            }
            return ValidationResult.Success;
        }
        
    }
}
