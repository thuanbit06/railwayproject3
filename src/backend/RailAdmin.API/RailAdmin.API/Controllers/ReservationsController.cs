using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin/reservations")]
[Authorize(Roles = "Admin")]
public class AdminReservationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminReservationsController(AppDbContext db)
    {
        _db = db;
    }

    // =========================================================
    // GET: /api/admin/reservations/recent?count=5
    // =========================================================
    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentReservations(
        [FromQuery] int count = 5)
    {
        try
        {
            // Giới hạn count để tránh request quá lớn
            if (count <= 0)
                count = 5;

            if (count > 50)
                count = 50;

            var reservations = await _db.Reservations
                .AsNoTracking()

                // Passenger
                .Include(r => r.Passenger)

                // Schedule -> Train
                .Include(r => r.Schedule)
                    .ThenInclude(s => s.Train)

                // Schedule -> FromStation
                .Include(r => r.Schedule)
                    .ThenInclude(s => s.FromStation)

                // Schedule -> ToStation
                .Include(r => r.Schedule)
                    .ThenInclude(s => s.ToStation)

                // Reservation -> Tickets -> Seat
                .Include(r => r.Tickets)
                    .ThenInclude(t => t.Seat)

                .OrderByDescending(r => r.BookingDate)
                .Take(count)
                .ToListAsync();

            var recent = reservations.Select(r => new
            {
                // Reservation
                id = r.Id,

                // PNR
                pnr = r.Tickets
                    .OrderByDescending(t => t.IssuedAt)
                    .Select(t => t.PNR)
                    .FirstOrDefault()
                    ?? r.PNR
                    ?? "N/A",

                // Passenger
                passengerName = r.Passenger?.FullName ?? "N/A",

                passengerEmail = r.Passenger?.Email ?? "N/A",

                passengerPhone = r.Passenger?.Phone ?? "N/A",

                // Train
                trainName = r.Schedule?.Train?.TrainName ?? "N/A",

                trainNo = r.Schedule?.Train?.TrainNo ?? "N/A",

                // Route
                fromStation = r.Schedule?.FromStation?.Name ?? "N/A",

                toStation = r.Schedule?.ToStation?.Name ?? "N/A",

                // Journey
                journeyDate = r.JourneyDate.ToString("yyyy-MM-dd"),

                // Reservation status
                status = r.Status ?? "Unknown",

                // Booking date
                createdAt = r.BookingDate.ToString("dd/MM/yyyy HH:mm"),

                // Seat
                seatNo = r.Tickets
                    .Select(t => t.Seat != null
                        ? t.Seat.SeatNo
                        : null)
                    .FirstOrDefault()
                    ?? "Not Assigned"
            })
            .ToList();

            return Ok(recent);
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"[GetRecentReservations] Error: {ex}");

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message = "Failed to load recent reservations.",
                    error = ex.Message
                });
        }
    }


    // =========================================================
    // GET: /api/admin/reservations/stats
    // =========================================================
    [HttpGet("stats")]
    public async Task<IActionResult> GetReservationStats()
    {
        try
        {
            var confirmed = await _db.Reservations
                .CountAsync(r => r.Status == "Confirmed");

            var waiting = await _db.Reservations
                .CountAsync(r => r.Status == "Waiting");

            var pending = await _db.Reservations
                .CountAsync(r => r.Status == "Pending");

            var cancelled = await _db.Reservations
                .CountAsync(r => r.Status == "Cancelled");

            var total = await _db.Reservations.CountAsync();

            return Ok(new
            {
                confirmed,
                waiting,
                pending,
                cancelled,
                total,

                confirmedPercent =
                    total > 0
                        ? Math.Round((double)confirmed / total * 100, 1)
                        : 0,

                waitingPercent =
                    total > 0
                        ? Math.Round((double)waiting / total * 100, 1)
                        : 0,

                pendingPercent =
                    total > 0
                        ? Math.Round((double)pending / total * 100, 1)
                        : 0,

                cancelledPercent =
                    total > 0
                        ? Math.Round((double)cancelled / total * 100, 1)
                        : 0
            });
        }
        catch (Exception ex)
        {
            Console.WriteLine(
                $"[GetReservationStats] Error: {ex}");

            return StatusCode(
                StatusCodes.Status500InternalServerError,
                new
                {
                    message = "Failed to load reservation statistics.",
                    error = ex.Message
                });
        }
    }
}