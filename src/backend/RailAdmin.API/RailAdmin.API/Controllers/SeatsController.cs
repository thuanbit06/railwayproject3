using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/seats")]
public class SeatsController : ControllerBase
{
    private readonly AppDbContext _db;
    public SeatsController(AppDbContext db) => _db = db;

    // GET: /api/seats/available?scheduleId=1&journeyDate=2026-08-25
    [HttpGet("available")]
    public async Task<IActionResult> GetAvailableSeats(
        [FromQuery] int scheduleId,
        [FromQuery] DateTime journeyDate)
    {
        // 1. Lấy TrainId từ Schedule
        var schedule = await _db.Schedules
            .FirstOrDefaultAsync(s => s.Id == scheduleId);

        if (schedule == null)
            return NotFound("Schedule not found");

        // 2. Lấy danh sách ghế đã được đặt trong ngày đó
        var bookedSeatIds = await _db.Tickets
            .Where(t => t.Reservation != null &&
                        t.Reservation.ScheduleId == scheduleId &&
                        t.Reservation.JourneyDate.Date == journeyDate.Date)
            .Select(t => t.SeatId)
            .ToListAsync();

        // 3. Lấy ghế còn trống
        var availableSeats = await _db.Seats
            .Include(seat => seat.Coach)
            .Where(seat => seat.Coach != null &&
                           seat.Coach.TrainId == schedule.TrainId &&
                           !bookedSeatIds.Contains(seat.Id))
            .Select(seat => new
            {
                seat.Id,
                seat.SeatNo,
                seat.CoachId,
                ClassType = seat.Coach != null ? seat.Coach.ClassType : string.Empty,
                CoachNo = seat.Coach != null ? seat.Coach.CoachNo : string.Empty
            })
            .ToListAsync();

        return Ok(availableSeats);
    }
}