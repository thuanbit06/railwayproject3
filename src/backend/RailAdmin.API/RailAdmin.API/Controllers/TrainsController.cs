using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrainsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TrainsController(AppDbContext context)
    {
        _context = context;
    }


    // ============================================================
    // GET: api/trains
    // Lấy toàn bộ danh sách chuyến tàu / lịch trình
    // ============================================================
    [HttpGet]
    public async Task<IActionResult> GetAllTrains()
    {
        var schedules = await _context.Schedules
            .Include(s => s.Train)
            .Include(s => s.FromStation)
            .Include(s => s.ToStation)
            .Where(s => s.IsActive)
            .OrderBy(s => s.Train!.TrainNo)
            .Select(s => new TrainDto
            {
                Id = s.Id,
                TrainNo = s.Train != null
                    ? s.Train.TrainNo
                    : s.TrainId.ToString(),

                TrainName = s.Train != null
                    ? s.Train.TrainName
                    : string.Empty,

                FromStation = s.FromStation != null
                    ? s.FromStation.Name
                    : string.Empty,

                ToStation = s.ToStation != null
                    ? s.ToStation.Name
                    : string.Empty,

                DepartureTime = s.DepartureTime.ToString(@"hh\:mm"),

                ArrivalTime = s.ArrivalTime.ToString(@"hh\:mm"),

                Status = s.IsActive
                    ? "Scheduled"
                    : "Inactive"
            })
            .ToListAsync();

        return Ok(schedules);
    }


    // ============================================================
    // GET: api/trains/search
    // Ví dụ:
    // /api/trains/search?from=Hà Nội&to=Đà Nẵng&date=2026-08-25
    // ============================================================
    [HttpGet("search")]
    public async Task<IActionResult> SearchTrains(
        [FromQuery] string from,
        [FromQuery] string to,
        [FromQuery] DateTime date)
    {
        if (string.IsNullOrWhiteSpace(from))
        {
            return BadRequest(new
            {
                message = "Departure station is required."
            });
        }

        if (string.IsNullOrWhiteSpace(to))
        {
            return BadRequest(new
            {
                message = "Destination station is required."
            });
        }

        var rawSchedules = await _context.Schedules
            .Include(s => s.Train)
            .Include(s => s.FromStation)
            .Include(s => s.ToStation)
            .Where(s =>
                s.IsActive &&

                s.FromStation != null &&
                s.FromStation.Name.Contains(from) &&

                s.ToStation != null &&
                s.ToStation.Name.Contains(to)
            )
            .ToListAsync();


        // Lấy thứ trong tuần của ngày được chọn
        var dayOfWeek = (int)date.DayOfWeek;


        // Lấy danh sách TrainId có hoạt động trong ngày đó
        var operatingTrainIds = await _context.TrainOperatingDays
            .Where(x =>
    x.IsActive &&
    x.DayOfWeek == dayOfWeek
)
            .Select(x => x.TrainID)
            .Distinct()
            .ToListAsync();


        // Chỉ lấy những tàu hoạt động trong ngày đã chọn
        var schedules = rawSchedules
            .Where(s =>
                operatingTrainIds.Contains(s.TrainId)
            )
            .Select(s => new TrainDto
            {
                Id = s.Id,

                TrainNo = s.Train?.TrainNo
                    ?? s.TrainId.ToString(),

                TrainName = s.Train?.TrainName
                    ?? string.Empty,

                FromStation = s.FromStation?.Name
                    ?? string.Empty,

                ToStation = s.ToStation?.Name
                    ?? string.Empty,

                DepartureTime =
                    s.DepartureTime.ToString(@"hh\:mm"),

                ArrivalTime =
                    s.ArrivalTime.ToString(@"hh\:mm"),

                Status = "Scheduled"
            })
            .ToList();

        return Ok(schedules);
    }


    // ============================================================
    // GET: api/trains/5
    // Lấy chi tiết một Schedule
    // ============================================================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTrain(int id)
    {
        var schedule = await _context.Schedules
            .Include(s => s.Train)
            .Include(s => s.FromStation)
            .Include(s => s.ToStation)
            .Where(s => s.Id == id)
            .Select(s => new TrainDto
            {
                Id = s.Id,

                TrainNo = s.Train != null
                    ? s.Train.TrainNo
                    : s.TrainId.ToString(),

                TrainName = s.Train != null
                    ? s.Train.TrainName
                    : string.Empty,

                FromStation = s.FromStation != null
                    ? s.FromStation.Name
                    : string.Empty,

                ToStation = s.ToStation != null
                    ? s.ToStation.Name
                    : string.Empty,

                DepartureTime =
                    s.DepartureTime.ToString(@"hh\:mm"),

                ArrivalTime =
                    s.ArrivalTime.ToString(@"hh\:mm"),

                Status = s.IsActive
                    ? "Scheduled"
                    : "Inactive"
            })
            .FirstOrDefaultAsync();

        if (schedule == null)
        {
            return NotFound(new
            {
                message = "Train schedule not found."
            });
        }

        return Ok(schedule);
    }


    // ============================================================
    // GET: api/trains/5/operating-days
    // Lấy các ngày hoạt động của tàu
    // ============================================================
    [HttpGet("{trainId}/operating-days")]
    public async Task<IActionResult> GetOperatingDays(int trainId)
    {
        var trainExists = await _context.Trains
            .AnyAsync(t => t.Id == trainId);

        if (!trainExists)
        {
            return NotFound(new
            {
                message = "Train not found."
            });
        }

        var days = await _context.TrainOperatingDays
            .Where(x =>
                x.TrainID == trainId &&
                x.IsActive
            )
            .Select(x => x.DayOfWeek)
            .ToListAsync();

        return Ok(days);
    }
}