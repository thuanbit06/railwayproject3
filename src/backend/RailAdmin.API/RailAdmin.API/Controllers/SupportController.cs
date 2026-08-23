using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs;
using RailAdmin.API.Models;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/support")]
public class SupportController : ControllerBase
{
    private readonly AppDbContext _db;
    public SupportController(AppDbContext db) => _db = db;

    // POST /api/support/ticket
    [HttpPost("ticket")]
    public async Task<IActionResult> CreateTicket([FromBody] CreateSupportTicketRequest req)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var ticket = new SupportTicket
        {
            Name = req.Name,
            Email = req.Email,
            Category = req.Category,
            Subject = req.Subject,
            Message = req.Message,
            UserId = req.UserId,
            Status = "Open",
            CreatedAt = DateTime.UtcNow
        };

        _db.SupportTickets.Add(ticket);
        await _db.SaveChangesAsync();

        return Ok(new
        {
            message = "Support ticket submitted successfully",
            ticketId = ticket.Id,
            status = ticket.Status
        });
    }

    // GET /api/support/tickets?email=xxx
    [HttpGet("tickets")]
    public async Task<IActionResult> GetTicketsByEmail([FromQuery] string email)
    {
        if (string.IsNullOrWhiteSpace(email))
            return BadRequest(new { message = "Email is required" });

        var tickets = await _db.SupportTickets
            .Where(t => t.Email == email)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new
            {
                t.Id,
                t.Subject,
                t.Category,
                t.Status,
                t.CreatedAt,
                t.ResolvedAt
            })
            .ToListAsync();

        return Ok(tickets);
    }

    // GET /api/support/ticket/{id}
    [HttpGet("ticket/{id:int}")]
    public async Task<IActionResult> GetTicketById(int id)
    {
        var ticket = await _db.SupportTickets.FindAsync(id);
        if (ticket == null)
            return NotFound(new { message = "Ticket not found" });

        return Ok(ticket);
    }

    // PUT /api/support/ticket/{id}/status
    [HttpPut("ticket/{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(int id, [FromBody] UpdateTicketStatusRequest req)
    {
        var ticket = await _db.SupportTickets.FindAsync(id);
        if (ticket == null)
            return NotFound(new { message = "Ticket not found" });

        ticket.Status = req.Status;
        if (req.Status == "Resolved" || req.Status == "Closed")
            ticket.ResolvedAt = DateTime.UtcNow;

        await _db.SaveChangesAsync();
        return Ok(new { message = "Ticket status updated", status = ticket.Status });
    }

    // DELETE /api/support/ticket/{id}
    [HttpDelete("ticket/{id:int}")]
    public async Task<IActionResult> DeleteTicket(int id)
    {
        var ticket = await _db.SupportTickets.FindAsync(id);
        if (ticket == null)
            return NotFound(new { message = "Ticket not found" });

        _db.SupportTickets.Remove(ticket);
        await _db.SaveChangesAsync();
        return Ok(new { message = "Ticket deleted successfully" });
    }
}