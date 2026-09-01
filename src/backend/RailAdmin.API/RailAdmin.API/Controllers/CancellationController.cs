namespace RailAdmin.API.Controllers;
using global::RailAdmin.API.DTOs.Request.CancellationRule;
using global::RailAdmin.API.Services.IService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.Services;


[ApiController]
[Route("api/cancellations")]
[Authorize(Roles = "User,Admin")]
public class CancellationsController : ControllerBase
{
    private readonly ICancellationService _service;
    private readonly IRefundService _refundService;

    public CancellationsController(
        ICancellationService service,
        IRefundService refundService
        )
    {
        _service = service;
        _refundService = refundService;
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

        var result = await _service.CalculateCancellationAsync(dto.TicketId);

        return Ok(result);
    }


    // =========================================================
    // CREATE FROM CALCULATION
    // =========================================================

    [HttpPost("ticket/{ticketId:int}/refund")]
    public async Task<IActionResult> CreateRefund(int ticketId)
    {
        if (ticketId <= 0)
        {
            return BadRequest(new
            {
                message = "Ticket ID must be greater than 0."
            });
        }

        try
        {
            var refund =
                await _service
                    .CreateFromCalculationAsync(ticketId);

            return Ok(refund);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
    }
}