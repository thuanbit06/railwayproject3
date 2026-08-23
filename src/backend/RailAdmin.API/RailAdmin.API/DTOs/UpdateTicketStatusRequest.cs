using System.ComponentModel.DataAnnotations;

namespace RailAdmin.API.DTOs;

/// <summary>
/// DTO dùng để nhận dữ liệu từ client khi admin cập nhật trạng thái Support Ticket
/// </summary>
public class UpdateTicketStatusRequest
{
    [Required(ErrorMessage = "Status is required")]
    [RegularExpression(
        "^(Open|InProgress|Resolved|Closed)$",
        ErrorMessage = "Status must be one of: Open, InProgress, Resolved, Closed"
    )]
    public string Status { get; set; } = string.Empty;
}