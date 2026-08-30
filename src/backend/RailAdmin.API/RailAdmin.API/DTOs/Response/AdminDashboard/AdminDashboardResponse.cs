namespace RailAdmin.API.DTOs.Response.AdminDashboard;

public class AdminDashboardResponse
{
    public DashboardStatsResponse Stats { get; set; } = new();

    public List<RevenueResponse> Revenue { get; set; } = new();

    public List<DistributionResponse> Distribution { get; set; } = new();
}

// =========================================================
// DASHBOARD STATISTICS
// =========================================================
public class DashboardStatsResponse
{
    public int TotalTrains { get; set; }

    public int TotalReservations { get; set; }

    public int TicketsSold { get; set; }

    public decimal TotalRevenue { get; set; }
}

// =========================================================
// REVENUE CHART
// =========================================================
public class RevenueResponse
{
    public DateTime Date { get; set; }

    public string Label { get; set; } = string.Empty;

    public decimal Revenue { get; set; }
}

// =========================================================
// DISTRIBUTION
// =========================================================
public class DistributionResponse
{
    public string Label { get; set; } = string.Empty;

    public int Value { get; set; }
}

// =========================================================
// RECENT RESERVATION
// =========================================================
public class RecentReservationResponse
{
    public string PNR { get; set; } = string.Empty;

    public string PassengerName { get; set; } = string.Empty;

    public string TrainName { get; set; } = string.Empty;

    public string TrainNo { get; set; } = string.Empty;

    public DateTime JourneyDate { get; set; }

    public decimal Amount { get; set; }

    public string Status { get; set; } = string.Empty;
}