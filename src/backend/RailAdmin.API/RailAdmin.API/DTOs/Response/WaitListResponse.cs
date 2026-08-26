namespace RailAdmin.API.DTOs.Response;

public class WaitListResponse
{
    public int Id { get; set; }
    public int TripId { get; set; }
    public int TicketId { get; set; }
    public string RequestedClass { get; set; } = string.Empty;
    public int Position { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? ExpiresAt { get; set; }
}