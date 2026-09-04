namespace RailAdmin.API.Services;

public class AnalyticsChartItem
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
}

public class TicketVolumeItem
{
    public DateTime Date { get; set; }
    public int Tickets { get; set; }
}