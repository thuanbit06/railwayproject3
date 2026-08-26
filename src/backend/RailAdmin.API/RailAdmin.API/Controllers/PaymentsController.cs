using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Payment;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/payments")]
[Authorize(Roles = "Admin")]
public class PaymentsController : ControllerBase
{
    private readonly IPaymentService _service;
    public PaymentsController(IPaymentService service) { _service = service; }

    [HttpGet] public async Task<IActionResult> GetAll() => Ok(await _service.GetAllAsync());
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var r = await _service.GetByIdAsync(id);
        if (r == null) return NotFound(new { message = $"Payment {id} not found." });
        return Ok(r);
    }
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] PaymentCreateRequest dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var c = await _service.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = c.Id }, c);
    }
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] PaymentUpdateRequest dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);
        var ok = await _service.UpdateAsync(id, dto);
        if (!ok) return NotFound(new { message = $"Payment {id} not found." });
        return NoContent();
    }
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var ok = await _service.DeleteAsync(id);
        if (!ok) return NotFound(new { message = $"Payment {id} not found." });
        return NoContent();
    }
}