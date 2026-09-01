using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.Services;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/refunds")]
[Authorize(Roles = "Admin")]
public class RefundsController : ControllerBase
{
    private readonly IRefundService _refundService;

    public RefundsController(IRefundService refundService)
    {
        _refundService = refundService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var refunds = await _refundService.GetAllAsync();

        return Ok(refunds);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                message = "Refund ID must be greater than 0."
            });
        }

        var refund =
            await _refundService.GetByIdAsync(id);

        if (refund == null)
        {
            return NotFound(new
            {
                message =
                    $"Refund with ID {id} was not found."
            });
        }

        return Ok(refund);
    }

    // =========================================================
    // GET BY TICKET ID
    // =========================================================

    [HttpGet("ticket/{ticketId:int}")]
    public async Task<IActionResult> GetByTicketId(
        int ticketId)
    {
        if (ticketId <= 0)
        {
            return BadRequest(new
            {
                message =
                    "Ticket ID must be greater than 0."
            });
        }

        var refund =
            await _refundService
                .GetByTicketIdAsync(ticketId);

        if (refund == null)
        {
            return NotFound(new
            {
                message =
                    $"Refund for Ticket {ticketId} was not found."
            });
        }

        return Ok(refund);
    }

    // =========================================================
    // CREATE
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] RefundCreateRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var refund =
                await _refundService
                    .CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = refund.Id },
                refund);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
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
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] RefundUpdateRequest dto)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                message =
                    "Refund ID must be greater than 0."
            });
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var updated =
                await _refundService
                    .UpdateAsync(id, dto);

            if (!updated)
            {
                return NotFound(new
                {
                    message =
                        $"Refund with ID {id} was not found."
                });
            }

            var refund =
                await _refundService
                    .GetByIdAsync(id);

            return Ok(refund);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    // =========================================================
    // DELETE
    // =========================================================

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                message =
                    "Refund ID must be greater than 0."
            });
        }

        var deleted =
            await _refundService
                .DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message =
                    $"Refund with ID {id} was not found."
            });
        }

        return Ok(new
        {
            message =
                "Refund deleted successfully."
        });
    }

    // =========================================================
    // PROCESS REFUND
    // =========================================================

    [HttpPost("{refundId:int}/process")]
    public async Task<IActionResult> Process(int refundId)
    {
        if (refundId <= 0)
        {
            return BadRequest(new
            {
                message = "Refund ID must be greater than 0."
            });
        }

        try
        {
            var refund =
                await _refundService.ProcessAsync(refundId);

            return Ok(refund);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }


    // =========================================================
    // MARK REFUND AS FAILED
    // =========================================================

    [HttpPost("{refundId:int}/failed")]
    public async Task<IActionResult> MarkAsFailed(int refundId)
    {
        if (refundId <= 0)
        {
            return BadRequest(new
            {
                message = "Refund ID must be greater than 0."
            });
        }

        try
        {
            var updated =
                await _refundService
                    .MarkAsFailedAsync(refundId);

            if (!updated)
            {
                return NotFound(new
                {
                    message =
                        $"Refund with ID {refundId} was not found."
                });
            }

            var refund =
                await _refundService
                    .GetByIdAsync(refundId);

            return Ok(refund);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }
}