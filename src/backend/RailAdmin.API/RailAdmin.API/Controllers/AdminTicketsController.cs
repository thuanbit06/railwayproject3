using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.DTOs.Request.Ticket;

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
    [ProducesResponseType(typeof(List<TicketAdminResponseDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTickets()
    {
        var tickets = await _db.Tickets
            .AsNoTracking()
            .OrderByDescending(t => t.Id)
            .Select(t => new TicketAdminResponseDto
            {
                Id = t.Id,
                Pnr = t.PNR,
                PassengerName = t.PassengerName,
                Age = t.Age,
                Gender = t.Gender,
                SeatId = t.SeatId,
                SeatNo = t.Seat != null ? t.Seat.SeatNo : "N/A",
                CoachNo = t.Seat != null && t.Seat.Coach != null ? t.Seat.Coach.CoachNo : "N/A",
                Fare = t.Fare,
                Status = t.Status,

                TrainName = t.Booking != null && t.Booking.Trip != null && t.Booking.Trip.Train != null
                    ? t.Booking.Trip.Train.TrainName
                    : "N/A",

                TrainNo = t.Booking != null && t.Booking.Trip != null && t.Booking.Trip.Train != null
                    ? t.Booking.Trip.Train.TrainNo
                    : "N/A",

                FromStation = t.Booking != null && t.Booking.Trip != null && t.Booking.Trip.FromStation != null
                    ? t.Booking.Trip.FromStation.Name
                    : "N/A",

                ToStation = t.Booking != null && t.Booking.Trip != null && t.Booking.Trip.ToStation != null
                    ? t.Booking.Trip.ToStation.Name
                    : "N/A",

                JourneyDate = t.Booking != null && t.Booking.Trip != null
                    ? t.Booking.Trip.JourneyDate
                    : null,

                DepartureTime = t.Booking != null && t.Booking.Trip != null
                    ? t.Booking.Trip.DepartureTime
                    : null,

                BookingStatus = t.Booking != null ? t.Booking.BookingStatus : "N/A",
                BookedBy = t.Booking != null && t.Booking.User != null ? t.Booking.User.Name : "N/A"
            })
            .ToListAsync();

        return Ok(tickets);
    }

    // =====================================================
    // PUT/PATCH: /api/admin/tickets/{id}/cancel
    // =====================================================
    [HttpPut("{id}/cancel")]
    [ProducesResponseType(typeof(ApiResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponseDto), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> CancelTicket(int id, [FromBody] CancelTicketRequestDto request)
    {
        var ticket = await _db.Tickets.FindAsync(id);

        if (ticket == null)
            return NotFound(new ApiResponseDto { Success = false, Message = "Ticket not found." });

        ticket.Status = "Cancelled";
        ticket.CancelReason = request.Reason ?? "Cancelled by admin";
        ticket.CancelledAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();

        return Ok(new ApiResponseDto { Success = true, Message = "Ticket cancelled successfully." });
    }

    // =====================================================
    // DELETE: /api/admin/tickets/{id}
    // =====================================================
    [HttpDelete("{id}")]
    [ProducesResponseType(typeof(ApiResponseDto), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponseDto), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTicket(int id)
    {
        var ticket = await _db.Tickets.FindAsync(id);

        if (ticket == null)
            return NotFound(new ApiResponseDto { Success = false, Message = "Ticket not found." });

        _db.Tickets.Remove(ticket);
        await _db.SaveChangesAsync();

        return Ok(new ApiResponseDto { Success = true, Message = "Ticket deleted successfully." });
    }
}