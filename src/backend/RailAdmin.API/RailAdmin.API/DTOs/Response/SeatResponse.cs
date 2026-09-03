namespace RailAdmin.API.DTOs.Response;

public class SeatResponse
{
    public int Id { get; set; }

    public int CoachId { get; set; }

    public string SeatNo { get; set; } = string.Empty;

    public string? BerthType { get; set; }

    // Thông tin Coach (nếu có)
    public string CoachNo { get; set; } = "N/A";

    public string ClassType { get; set; } = "N/A";

    public int? TrainId { get; set; }
}