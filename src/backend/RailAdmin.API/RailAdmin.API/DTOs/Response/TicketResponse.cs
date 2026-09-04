namespace RailAdmin.API.DTOs.Response;

public class TicketResponse
{
    // =====================================================
    // TICKET
    // =====================================================

    public int Id { get; set; }

    public string PNR { get; set; } = string.Empty;

    public int? SeatId { get; set; }

    public string PassengerName { get; set; } = string.Empty;

    public int Age { get; set; }

    public string Gender { get; set; } = string.Empty;

    public decimal Fare { get; set; }

    public string Status { get; set; } = string.Empty;

    public string? CancelReason { get; set; }

    public DateTime? CancelledAt { get; set; }

}