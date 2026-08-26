namespace RailAdmin.API.DTOs.Response;

public class SeatResponse
{
    public int Id { get; set; }
    public int CoachId { get; set; }
    public string SeatNo { get; set; } = string.Empty;
}