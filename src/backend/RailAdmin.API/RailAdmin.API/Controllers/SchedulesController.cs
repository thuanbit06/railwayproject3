using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/schedules")]
public class SchedulesController : ControllerBase
{
    private readonly AppDbContext _db;
    public SchedulesController(AppDbContext db) => _db = db;

    // =====================================================
    // API 1: Tìm chuyến tàu theo ga đi / ga đến
    // =====================================================
    [HttpGet("search")]
    public async Task<ActionResult<IEnumerable<Schedule>>> SearchTrains(
        [FromQuery] string fromCode,
        [FromQuery] string toCode)
    {
        var from = await _db.Stations.FirstOrDefaultAsync(s => s.Code == fromCode);
        var to = await _db.Stations.FirstOrDefaultAsync(s => s.Code == toCode);

        if (from == null || to == null)
            return BadRequest("Invalid station code");

        var result = await _db.Schedules
            .Where(s => s.FromStationId == from.Id &&
                        s.ToStationId == to.Id &&
                        s.IsActive)
            .Include(s => s.Train)
            .Include(s => s.Stops)
            .ToListAsync();

        return Ok(result);
    }

    // =====================================================
    // API 2: Lấy danh sách trạm dừng của một lịch trình
    // =====================================================
    [HttpGet("{scheduleId:int}/stops")]
    public async Task<ActionResult<IEnumerable<ScheduleStop>>> GetStops(int scheduleId)
    {
        var stops = await _db.ScheduleStops
            .Where(s => s.ScheduleID == scheduleId)
            .OrderBy(s => s.StopSequence)
            .Include(s => s.Station) // ✅ Lấy tên ga
            .ToListAsync();

        return Ok(stops);
    }
}