using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TicketsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TicketsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/tickets/{pnr}
    // Lấy chi tiết vé theo PNR
    [HttpGet("{pnr}")]
    public async Task<IActionResult> GetByPNR(string pnr)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.PNR == pnr);

        if (ticket == null)
            return NotFound("Ticket not found");

        return Ok(ticket);
    }

    // POST: api/tickets/cancel/{pnr}
    // Hủy vé
    [HttpPost("cancel/{pnr}")]
    public async Task<IActionResult> CancelTicket(
        string pnr,
        [FromBody] CancelRequest req)
    {
        var ticket = await _context.Tickets
            .FirstOrDefaultAsync(t => t.PNR == pnr);

        if (ticket == null)
            return NotFound("Ticket not found");

        if (ticket.Status == "Cancelled")
            return BadRequest("Already cancelled");

        ticket.Status = "Cancelled";
        ticket.CancelReason = req.Reason;
        ticket.CancelledAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Ticket cancelled successfully"
        });
    }
}

public class CancelRequest
{
    public string Reason { get; set; } = string.Empty;
}