using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/tickets")]
[Authorize(Roles = "User")]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    // GET: api/tickets
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var tickets = await _ticketService.GetAllAsync();

        return Ok(tickets);
    }

    // GET: api/tickets/{id}
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var ticket = await _ticketService.GetByIdAsync(id);

        if (ticket == null)
        {
            return NotFound(new
            {
                message = $"Ticket {id} not found."
            });
        }

        return Ok(ticket);
    }

    // GET: api/tickets/by-pnr/{pnr}
    [HttpGet("by-pnr/{pnr}")]
    public async Task<IActionResult> GetByPNR(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                message = "PNR is required."
            });
        }

        var tickets = await _ticketService.GetByPNRAsync(pnr);

        if (!tickets.Any())
        {
            return NotFound(new
            {
                message = $"No tickets found for PNR {pnr}."
            });
        }

        return Ok(tickets);
    }

    // POST: api/tickets
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] TicketCreateRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var createdTicket = await _ticketService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = createdTicket.Id },
            createdTicket
        );
    }

    // PUT: api/tickets/{id}
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] TicketUpdateRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated = await _ticketService.UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new
            {
                message = $"Ticket {id} not found."
            });
        }

        return NoContent();
    }

    // DELETE: api/tickets/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await _ticketService.DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message = $"Ticket {id} not found."
            });
        }

        return NoContent();
    }
}