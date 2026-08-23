using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin/tickets")]
[Authorize(Roles = "Admin")]
public class AdminTicketsController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminTicketsController(AppDbContext db)
    {
        _db = db;
    }


    // =====================================================
    // GET: /api/admin/tickets
    // =====================================================

    [HttpGet]
    public async Task<IActionResult> GetTickets()
    {
        var tickets = await _db.Tickets
            .Include(t => t.Reservation)
                .ThenInclude(r => r.Passenger)

            .Include(t => t.Reservation)
                .ThenInclude(r => r.Schedule)
                    .ThenInclude(s => s.Train)

            .OrderByDescending(t => t.IssuedAt)

            .Select(t => new
            {
                id = t.Id,

                pnr = t.PNR,

                passengerName =
                    t.Reservation != null &&
                    t.Reservation.Passenger != null
                        ? t.Reservation.Passenger.FullName
                        : "N/A",

                age =
                    t.Reservation != null &&
                    t.Reservation.Passenger != null
                        ? t.Reservation.Passenger.Age
                        : 0,

                trainName =
                    t.Reservation != null &&
                    t.Reservation.Schedule != null &&
                    t.Reservation.Schedule.Train != null
                        ? t.Reservation.Schedule.Train.TrainName
                        : "N/A",

                journeyDate =
                    t.Reservation != null
                        ? t.Reservation.JourneyDate
                        : (DateTime?)null,

                fare = t.Fare,

                status = t.PaymentStatus,

                issuedAt = t.IssuedAt
            })

            .ToListAsync();

        return Ok(tickets);
    }


    // =====================================================
    // DELETE: /api/admin/tickets/{id}
    // =====================================================

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTicket(int id)
    {
        var ticket = await _db.Tickets.FindAsync(id);

        if (ticket == null)
        {
            return NotFound(new
            {
                message = "Ticket not found."
            });
        }

        _db.Tickets.Remove(ticket);

        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Ticket deleted successfully."
        });
    }
}