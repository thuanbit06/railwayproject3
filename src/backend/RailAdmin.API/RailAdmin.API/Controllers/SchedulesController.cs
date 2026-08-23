using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs;
using RailAdmin.API.Models;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SchedulesController : ControllerBase
{
    private readonly AppDbContext _db;

    public SchedulesController(AppDbContext db) => _db = db;

    // =========================================================
    // GET: api/schedules/{scheduleId}/stops
    // Lấy danh sách trạm dừng của 1 lịch trình
    // =========================================================
    [HttpGet("{scheduleId:int}/stops")]
    public async Task<ActionResult<IEnumerable<ScheduleStopDto>>> GetStops(int scheduleId)
    {
        // Kiểm tra schedule tồn tại
        var scheduleExists = await _db.Schedules
            .AnyAsync(s => s.Id == scheduleId && s.IsActive);

        if (!scheduleExists)
            return NotFound(new { message = "Schedule not found or inactive." });

        var stops = await _db.ScheduleStops
            .Where(ss => ss.ScheduleID == scheduleId)
            .Include(ss => ss.Station)
            .OrderBy(ss => ss.StopSequence)
            .Select(ss => new ScheduleStopDto
            {
                StationName = ss.Station != null ? ss.Station.Name : "Unknown",
                StationCode = ss.Station != null ? ss.Station.Code : "N/A",
                ArrivalTime = ss.ArrivalTime.HasValue
                    ? ss.ArrivalTime.Value.ToString(@"hh\:mm")
                    : null,
                DepartureTime = ss.DepartureTime.HasValue
                    ? ss.DepartureTime.Value.ToString(@"hh\:mm")
                    : null,
                HaltDuration = ss.HaltDurationMinutes.HasValue && ss.HaltDurationMinutes > 0
                    ? $"{ss.HaltDurationMinutes} min"
                    : "--",
                Distance = (int)ss.DistanceFromOrigin,
                Status = "upcoming",  // Sẽ tính động bên dưới
                IconName = GetIconName(ss.StopSequence, 0) // tạm thời
            })
            .ToListAsync();

        // Tính trạng thái động (giả lập: trạm đầu = completed, trạm 2 = current, còn lại = upcoming)
        // Sau này bạn có thể so sánh với DateTime.Now + ArrivalTime
        for (int i = 0; i < stops.Count; i++)
        {
            stops[i].Status = i == 0 ? "completed" : i == 1 ? "current" : "upcoming";
            stops[i].IconName = GetIconName(i, stops.Count);
        }

        return Ok(stops);
    }

    // =========================================================
    // GET: api/schedules/{scheduleId}/detail
    // Lấy TẤT CẢ: thông tin tàu + operating days + stops
    // → Frontend chỉ cần gọi 1 API này là đủ cho trang TrainScheduleDetail
    // =========================================================
    [HttpGet("{scheduleId:int}/detail")]
    public async Task<ActionResult<ScheduleDetailDto>> GetScheduleDetail(int scheduleId)
    {
        var schedule = await _db.Schedules
            .Include(s => s.Train)
            .Include(s => s.FromStation)
            .Include(s => s.ToStation)
            .FirstOrDefaultAsync(s => s.Id == scheduleId && s.IsActive);

        if (schedule == null)
            return NotFound(new { message = "Schedule not found or inactive." });

        // Lấy Operating Days
        var operatingDays = new List<string>();
        if (schedule.TrainId > 0)
        {
            var dayNumbers = await _db.TrainOperatingDays
                .Where(x => x.TrainID == schedule.TrainId && x.IsActive)
                .Select(x => x.DayOfWeek)
                .ToListAsync();

            operatingDays = dayNumbers
                .OrderBy(d => d)
                .Select(d => new[] { "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday" }[d])
                .ToList();
        }

        // Lấy Stops
        var stops = await _db.ScheduleStops
            .Where(ss => ss.ScheduleID == scheduleId)
            .Include(ss => ss.Station)
            .OrderBy(ss => ss.StopSequence)
            .Select(ss => new ScheduleStopDto
            {
                StationName = ss.Station != null ? ss.Station.Name : "Unknown",
                StationCode = ss.Station != null ? ss.Station.Code : "N/A",
                ArrivalTime = ss.ArrivalTime.HasValue
                    ? ss.ArrivalTime.Value.ToString(@"hh\:mm")
                    : null,
                DepartureTime = ss.DepartureTime.HasValue
                    ? ss.DepartureTime.Value.ToString(@"hh\:mm")
                    : null,
                HaltDuration = ss.HaltDurationMinutes.HasValue && ss.HaltDurationMinutes > 0
                    ? $"{ss.HaltDurationMinutes} min"
                    : "--",
                Distance = (int)ss.DistanceFromOrigin,
                Status = "upcoming",
                IconName = "Train"
            })
            .ToListAsync();

        // Tính trạng thái stops
        for (int i = 0; i < stops.Count; i++)
        {
            stops[i].Status = i == 0 ? "completed" : i == 1 ? "current" : "upcoming";
            stops[i].IconName = GetIconName(i, stops.Count);
        }

        // Tính total distance
        var totalDistance = stops.Any() ? stops.Max(s => s.Distance) : (int)schedule.DistanceKm;

        // Build DTO
        var result = new ScheduleDetailDto
        {
            ScheduleId = schedule.Id,
            TrainId = schedule.TrainId,
            TrainNumber = schedule.Train?.TrainNo ?? schedule.TrainId.ToString(),
            TrainName = schedule.Train?.TrainName ?? "Unknown Train",
            OperatingDays = string.Join(", ", operatingDays),
            Status = "On Time",
            AvgSpeed = totalDistance > 0 && schedule.DepartureTime != schedule.ArrivalTime
                ? CalculateAvgSpeed(totalDistance, schedule.DepartureTime, schedule.ArrivalTime)
                : 0,
            TotalDistance = totalDistance,
            Reliability = "98.4%", // Có thể tính từ bảng AuditLog sau này
            Stops = stops
        };

        return Ok(result);
    }

    // =========================================================
    // HELPER: Map icon theo vị trí trạm
    // =========================================================
    private static string GetIconName(int index, int total)
    {
        if (index == 0) return "Home";           // Ga xuất phát
        if (index == total - 1) return "Flag";   // Ga cuối
        if (index == 1) return "Navigation";
        if (index == 2) return "MapPin";
        return "Activity";
    }

    // =========================================================
    // HELPER: Tính tốc độ trung bình (km/h)
    // =========================================================
    private static int CalculateAvgSpeed(int distanceKm, TimeSpan departure, TimeSpan arrival)
    {
        var totalMinutes = (arrival - departure).TotalMinutes;
        if (totalMinutes <= 0) totalMinutes = 1; // tránh chia 0
        var speed = distanceKm / (totalMinutes / 60.0);
        return (int)Math.Round(speed);
    }
}