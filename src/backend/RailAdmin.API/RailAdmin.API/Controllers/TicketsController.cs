using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/tickets")]
[Authorize(Roles = "Admin")]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _service;
    public TicketsController(ITicketService service) { _service = service; }

    [HttpGet]
    public async Task<IActionResult> GetAll()
        => Ok(await _service.GetAllAsync());

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var t = await _service.GetByIdAsync(id);
        if (t == null) return NotFound(new { message = $"Ticket {id} not found." });
        return Ok(t);
    }

    // ✅ MỚI: Lấy danh sách vé theo PNR
    [HttpGet("by-pnr/{pnr}")]
    public async Task<IActionResult> GetByPNR(string pnr)
    {
        var list = await _service.GetByPNRAsync(pnr);
        if (!list.Any())
            return NotFound(new { message = $"No tickets found for PNR {pnr}." });
        return Ok(list);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] TicketCreateRequest dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var created = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] TicketUpdateRequest dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var ok = await _service.UpdateAsync(id, dto);
        if (!ok) return NotFound(new { message = $"Ticket {id} not found." });
        return NoContent();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound(new { message = $"Ticket {id} not found." });
        return NoContent();
    }
}