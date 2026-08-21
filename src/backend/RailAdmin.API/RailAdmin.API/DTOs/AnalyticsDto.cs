namespace RailAdmin.API.DTOs;

public class AnalyticsDto
{
    public decimal TotalRevenue { get; set; }

    public int TicketsSold { get; set; }

    public int TotalUsers { get; set; }

    public decimal? OccupancyRate { get; set; }

    public List<ClassDistributionDto> ClassDistribution { get; set; } = new();

    public List<RevenueDataDto> Revenue { get; set; } = new();

    public List<TicketVolumeDto> TicketVolume { get; set; } = new();
}

public class RevenueDataDto
{
    public string Name { get; set; } = string.Empty;

    public decimal Revenue { get; set; }
}

public class TicketVolumeDto
{
    public string Name { get; set; } = string.Empty;

    public int Tickets { get; set; }
}

public class ClassDistributionDto
{
    public string Name { get; set; } = string.Empty;

    public decimal Value { get; set; }
}