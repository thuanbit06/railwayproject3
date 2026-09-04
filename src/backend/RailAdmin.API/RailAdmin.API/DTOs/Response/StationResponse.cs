namespace RailAdmin.API.DTOs.Response;

public class StationResponse
{
    public int Id { get; set; }

    public string Code { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;
}