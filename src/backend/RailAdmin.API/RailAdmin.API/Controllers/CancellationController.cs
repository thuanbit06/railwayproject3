namespace RailAdmin.API.Controllers;
using global::RailAdmin.API.DTOs.Request.CancellationRule;
using global::RailAdmin.API.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;


[ApiController]
[Route("api/cancellations")]
[Authorize(Roles = "User,Admin")]
public class CancellationsController : ControllerBase
{
    private readonly ICancellationService _service;

    public CancellationsController(
        ICancellationService service)
    {
        _service = service;
    }

    // =========================================================
    // CALCULATE REFUND BEFORE CANCELLING
    // =========================================================

    [HttpPost("calculate")]
    public async Task<IActionResult> Calculate(
        [FromBody] CancellationRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result =
            await _service
                .CalculateCancellationAsync(
                    dto.TicketId);

        return Ok(result);
    }

    // =========================================================
    // CHECK WHETHER CAN CANCEL
    // =========================================================

    [HttpGet("ticket/{ticketId:int}/allowed")]
    public async Task<IActionResult> IsAllowed(
        int ticketId)
    {
        var allowed =
            await _service
                .IsCancellationAllowedAsync(
                    ticketId);

        return Ok(new
        {
            ticketId,
            allowed
        });
    }

    // =========================================================
    // CANCEL TICKET
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Cancel(
        [FromBody] CancellationRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result =
            await _service
                .CancelTicketAsync(dto);

        return Ok(result);
    }
}