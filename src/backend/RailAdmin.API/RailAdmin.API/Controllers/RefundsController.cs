using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/refunds")]
[Authorize(Roles = "Admin")]
public class RefundsController : ControllerBase
{
    private readonly IRefundService _refundService;

    public RefundsController(
        IRefundService refundService)
    {
        _refundService = refundService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var refunds =
            await _refundService.GetAllAsync();

        return Ok(refunds);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var refund =
            await _refundService.GetByIdAsync(id);

        if (refund == null)
        {
            return NotFound(new
            {
                message =
                    $"Refund {id} not found."
            });
        }

        return Ok(refund);
    }

    // =========================================================
    // GET BY TICKET
    // =========================================================

    [HttpGet("ticket/{ticketId:int}")]
    public async Task<IActionResult>
        GetByTicketId(int ticketId)
    {
        var refund =
            await _refundService
                .GetByTicketIdAsync(ticketId);

        if (refund == null)
        {
            return NotFound(new
            {
                message =
                    $"Refund for ticket " +
                    $"{ticketId} not found."
            });
        }

        return Ok(refund);
    }

    // =========================================================
    // CREATE REFUND
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] RefundCreateRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var refund =
            await _refundService
                .CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = refund.Id },
            refund);
    }

    // =========================================================
    // PROCESS REFUND
    // =========================================================

    [HttpPost("{id:int}/process")]
    public async Task<IActionResult>
        Process(int id)
    {
        var refund =
            await _refundService
                .ProcessAsync(id);

        return Ok(refund);
    }

    // =========================================================
    // DELETE
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _refundService
                .DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message =
                    $"Refund {id} not found."
            });
        }

        return NoContent();
    }
}