namespace RailAdmin.API.DTOs
{
    public class ScheduleDetailDto
    {
        public int ScheduleId { get; set; }       // ← THÊM DÒNG NÀY
        public int TrainId { get; set; }
        public string TrainNumber { get; set; } = string.Empty;
        public string TrainName { get; set; } = string.Empty;
        public string OperatingDays { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int AvgSpeed { get; set; }
        public int TotalDistance { get; set; }
        public string Reliability { get; set; } = string.Empty;
        public List<ScheduleStopDto> Stops { get; set; } = new();
    }

    public class ScheduleStopDto
    {
        public string StationName { get; set; } = string.Empty;
        public string StationCode { get; set; } = string.Empty;
        public string? ArrivalTime { get; set; }
        public string? DepartureTime { get; set; }
        public string? HaltDuration { get; set; }
        public int Distance { get; set; }
        public string Status { get; set; } = "upcoming";
        public string IconName { get; set; } = "Train";
    }
}