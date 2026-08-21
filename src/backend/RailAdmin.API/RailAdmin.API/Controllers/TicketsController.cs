using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs;
using RailAdmin.API.Models;
using System.Security.Claims;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/tickets")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _db;
    public TicketsController(AppDbContext db) => _db = db;

    [Authorize]
    [HttpGet("my-tickets")]
    public async Task<IActionResult> GetMyTickets()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!int.TryParse(userIdClaim, out var userId))
            return Unauthorized(new { message = "Invalid token." });

        var tickets = await _db.Tickets
            .Where(t => t.Reservation != null && t.Reservation.BookedByUserId == userId)
            .Include(t => t.Reservation!)
                .ThenInclude(r => r.Schedule!)
                    .ThenInclude(s => s.Train)
            .Include(t => t.Reservation!)
                .ThenInclude(r => r.Schedule!)
                    .ThenInclude(s => s.FromStation)
            .Include(t => t.Reservation!)
                .ThenInclude(r => r.Schedule!)
                    .ThenInclude(s => s.ToStation)
            .OrderByDescending(t => t.IssuedAt)
            .Select(t => new
            {
                t.Id,
                TrainName = t.Reservation!.Schedule!.Train!.TrainName,
                FromStation = t.Reservation.Schedule!.FromStation!.Name,
                ToStation = t.Reservation.Schedule!.ToStation!.Name,
                JourneyDate = t.Reservation.JourneyDate,
                PNR = t.PNR,
                Status = t.Reservation.Status
            })
            .ToListAsync();

        return Ok(tickets);
    }

    // GET: /api/tickets/pnr/{pnr}
    [HttpGet("pnr/{pnr}")]
    public async Task<IActionResult> GetPNRStatus(string pnr)
    {
        var ticket = await _db.Tickets
            .Include(t => t.Reservation!)
                .ThenInclude(r => r.Passenger)
            .Include(t => t.Reservation!)
                .ThenInclude(r => r.Schedule!)
                    .ThenInclude(s => s.Train)
            .Include(t => t.Reservation!)
                .ThenInclude(r => r.Schedule!)
                    .ThenInclude(s => s.FromStation)
            .Include(t => t.Reservation!)
                .ThenInclude(r => r.Schedule!)
                    .ThenInclude(s => s.ToStation)
            .Include(t => t.Seat)
            .FirstOrDefaultAsync(t => t.PNR == pnr);

        if (ticket == null)
            return NotFound("PNR not found");

        var reservation = ticket.Reservation;
        var schedule = reservation?.Schedule;
        var train = schedule?.Train;
        var fromStation = schedule?.FromStation;
        var toStation = schedule?.ToStation;
        var seat = ticket.Seat;
        var passenger = reservation?.Passenger;

        var result = new
        {
            PNR = ticket.PNR,
            PaymentStatus = ticket.PaymentStatus,
            IssuedAt = ticket.IssuedAt,

            TrainName = train?.TrainName ?? "N/A",
            TrainNo = train?.TrainNo ?? "N/A",

            FromStation = fromStation?.Name ?? "N/A",
            ToStation = toStation?.Name ?? "N/A",

            JourneyDate = reservation?.JourneyDate,
            DepartureTime = schedule?.DepartureTime,

            SeatNo = seat?.SeatNo ?? "N/A",
            CoachClass = ticket.CoachClass,

            Fare = ticket.Fare,
            GSTAmount = ticket.GSTAmount,
            TotalAmount = ticket.TotalAmount,

            Passenger = passenger == null ? null : new
            {
                FullName = passenger.FullName,
                Age = passenger.Age,
                Gender = passenger.Gender
            }
        };

        return Ok(result);
    }

    // POST: /api/tickets/book
    [HttpPost("book")]
    public async Task<IActionResult> BookTicket([FromBody] BookTicketRequest req)
    {
        // 1. Kiểm tra ghế còn trống không
        var seat = await _db.Seats.FindAsync(req.SeatId);
        if (seat == null)
            return BadRequest("Seat not found");

        if (seat.IsBooked)
            return BadRequest("Seat already booked");

        // 2. Tạo Reservation
        var reservation = new Reservation
        {
            PNR = GeneratePNR(),
            ScheduleId = req.ScheduleId,
            PassengerId = req.PassengerId,
            JourneyDate = req.JourneyDate,
            Status = "Confirmed",
            BookedByUserId = req.UserId
        };

        _db.Reservations.Add(reservation);
        await _db.SaveChangesAsync();

        // 3. Tạo Ticket
        var ticket = new Ticket
        {
            PNR = reservation.PNR,
            ReservationId = reservation.Id,
            SeatId = req.SeatId,
            CoachClass = req.CoachClass,
            Fare = req.Fare,
            GSTAmount = req.Fare * 0.05m,
            TotalAmount = req.Fare * 1.05m,
            PaymentStatus = "Paid",
            IssuedAt = DateTime.UtcNow
        };

        _db.Tickets.Add(ticket);

        // 4. Cập nhật trạng thái ghế
        seat.IsBooked = true;
        seat.BookedUntil = req.JourneyDate;

        await _db.SaveChangesAsync();

        return Ok(new { ticket.PNR, ticket.TotalAmount });
    }

    private static string GeneratePNR()
    {
        return "PNR" + Guid.NewGuid().ToString("N")[..7].ToUpper();
    }
}