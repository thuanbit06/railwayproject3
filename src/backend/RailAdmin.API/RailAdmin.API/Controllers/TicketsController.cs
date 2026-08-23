using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/tickets")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _db;

    public TicketsController(AppDbContext db)
    {
        _db = db;
    }

    // =====================================================
    // GET: /api/tickets/pnr/{pnr}
    // =====================================================

    [HttpGet("pnr/{pnr}")]
    public async Task<IActionResult> GetPNRStatus(string pnr)
    {
        var ticket = await _db.Tickets
            .Include(t => t.Reservation)
                .ThenInclude(r => r.Passenger)

            .Include(t => t.Reservation)
                .ThenInclude(r => r.Schedule)
                    .ThenInclude(s => s.Train)

            .Include(t => t.Reservation)
                .ThenInclude(r => r.Schedule)
                    .ThenInclude(s => s.FromStation)

            .Include(t => t.Reservation)
                .ThenInclude(r => r.Schedule)
                    .ThenInclude(s => s.ToStation)

            .Include(t => t.Seat)

            .FirstOrDefaultAsync(t => t.PNR == pnr);

        if (ticket == null)
        {
            return NotFound(new
            {
                message = $"PNR '{pnr}' not found."
            });
        }

        var reservation = ticket.Reservation;

        if (reservation == null)
        {
            return NotFound(new
            {
                message = "Reservation data not found."
            });
        }

        var schedule = reservation.Schedule;

        var result = new
        {
            id = ticket.Id,

            pnr = ticket.PNR,

            status = ticket.PaymentStatus,

            paymentStatus = ticket.PaymentStatus,

            trainName =
                schedule?.Train?.TrainName ?? "N/A",

            trainNo =
                schedule?.Train?.TrainNo ?? "N/A",

            fromStation =
                schedule?.FromStation?.Name ?? "N/A",

            toStation =
                schedule?.ToStation?.Name ?? "N/A",

            journeyDate =
                reservation.JourneyDate.ToString("yyyy-MM-dd"),

            departureTime =
                schedule?.DepartureTime
                    .ToString(@"hh\:mm\:ss") ?? "",

            seatNo =
                ticket.Seat?.SeatNo ?? "N/A",

            coachClass =
                ticket.CoachClass ?? "N/A",

            fare = ticket.Fare,

            gstAmount = ticket.GSTAmount,

            totalAmount = ticket.TotalAmount,

            passenger =
                reservation.Passenger == null
                    ? null
                    : new
                    {
                        fullName =
                            reservation.Passenger.FullName,

                        age =
                            reservation.Passenger.Age,

                        gender =
                            reservation.Passenger.Gender,

                        email =
                            reservation.Passenger.Email,

                        phone =
                            reservation.Passenger.Phone
                    }
        };

        return Ok(result);
    }


    // =====================================================
    // PUT: /api/tickets/{pnr}/cancel
    // =====================================================

    [HttpPut("{pnr}/cancel")]
    public async Task<IActionResult> CancelTicket(
        string pnr,
        [FromBody] CancelTicketRequest? request)
    {
        try
        {
            var ticket = await _db.Tickets
                .Include(t => t.Reservation)
                .FirstOrDefaultAsync(t => t.PNR == pnr);

            if (ticket == null)
            {
                return NotFound(new
                {
                    message = $"Ticket with PNR '{pnr}' not found."
                });
            }

            // Nếu đã hủy
            if (ticket.PaymentStatus == "Cancelled")
            {
                return BadRequest(new
                {
                    message = "This ticket is already cancelled."
                });
            }

            // Hủy ticket
            ticket.PaymentStatus = "Cancelled";

            // Hủy reservation liên quan
            if (ticket.Reservation != null)
            {
                ticket.Reservation.Status = "Cancelled";
            }

            await _db.SaveChangesAsync();

            return Ok(new
            {
                message = "Ticket cancelled successfully.",

                pnr = ticket.PNR,

                status = ticket.PaymentStatus,

                reason = request?.Reason
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new
            {
                message = "Failed to cancel ticket.",

                error = ex.Message
            });
        }
    }
}