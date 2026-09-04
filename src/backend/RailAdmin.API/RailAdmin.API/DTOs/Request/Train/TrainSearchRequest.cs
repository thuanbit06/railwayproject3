namespace RailAdmin.API.DTOs.Request.Train;

public class TrainSearchRequest
{
    public string? Search { get; set; }

    public string? TrainNo { get; set; }

    public string? TrainName { get; set; }

    public string? TrainType { get; set; }

    public bool? IsActive { get; set; }
}