using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.Services.IService;
using System.Security.Claims;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/tickets")]
[Authorize(Roles = "User")]
[ProducesResponseType(StatusCodes.Status403Forbidden)]
public class TicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public TicketsController(
        ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    // =========================================================
    // GET MY TICKETS
    // GET /api/tickets/my-tickets
    // =========================================================

    [HttpGet("my-tickets")]
    public async Task<IActionResult> GetMyTickets()
    {
        var userId = GetCurrentUserId();

        if (userId == null)
        {
            return Unauthorized(new
            {
                success = false,
                message = "Không xác định được UserId từ token."
            });
        }

        var tickets =
            await _ticketService
                .GetByUserIdAsync(userId.Value);

        return Ok(tickets);
    }

    // =========================================================
    // GET BY PNR
    // GET /api/tickets/pnr/{pnr}
    // =========================================================

    [HttpGet("pnr/{pnr}")]
    public async Task<IActionResult> GetByPNR(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                success = false,
                message = "PNR {pnr} không được để trống."
            });
        }

        var tickets =
            await _ticketService
                .GetByPNRAsync(pnr);

        if (!tickets.Any())
        {
            return NotFound(new
            {
                success = false,
                message = "Không tìm thấy vé."
            });
        }

        return Ok(tickets);
    }

    // =========================================================
    // GET BY ID
    // GET /api/tickets/{id}
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(
        int id)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                success = false,
                message = "Ticket ID không hợp lệ."
            });
        }

        var ticket =
            await _ticketService
                .GetByIdAsync(id);

        if (ticket == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Không tìm thấy vé."
            });
        }

        return Ok(ticket);
    }

    // =========================================================
    // CREATE TICKET
    // POST /api/tickets
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] TicketCreateRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var result =
                await _ticketService
                    .CreateAsync(request);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                success = false,
                message = ex.Message
            });
        }
    }

    // =========================================================
    // UPDATE
    // PUT /api/tickets/{id}
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] TicketUpdateRequest request)
    {
        if (!ModelState.IsValid)
            return ValidationProblem(ModelState);

        try
        {
            var result =
                await _ticketService
                    .UpdateAsync(
                        id,
                        request);

            if (!result)
            {
                return NotFound(new
                {
                    success = false,
                    message = "Không tìm thấy vé."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Cập nhật vé thành công."
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                success = false,
                message = ex.Message
            });
        }
    }

    // =========================================================
    // CANCEL BOOKING BY PNR
    // PUT /api/tickets/{pnr}/cancel
    // =========================================================

    [HttpPut("{pnr}/cancel")]
    public async Task<IActionResult> Cancel(
        string pnr,
        [FromBody] CancelTicketRequestDto? request)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                success = false,
                message = "PNR không được để trống."
            });
        }

        try
        {
            var reason =
                string.IsNullOrWhiteSpace(request?.Reason)
                    ? "Cancelled by user."
                    : request.Reason.Trim();

            var result =
                await _ticketService
                    .CancelAsync(
                        pnr,
                        reason);

            if (!result)
            {
                return BadRequest(new
                {
                    success = false,
                    message =
                        "Không thể hủy vé. Booking không tồn tại, đã bị hủy hoặc không còn vé hợp lệ."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Hủy booking thành công.",
                pnr = pnr.Trim()
            });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                success = false,
                message = ex.Message
            });
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                success = false,
                message = ex.Message
            });
        }
    }

    // =========================================================
    // CHECK CANCELLABLE
    // GET /api/tickets/{id}/cancellable
    // =========================================================

    [HttpGet("{id:int}/cancellable")]
    public async Task<IActionResult> IsCancellable(
        int id)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                success = false,
                message = $"Ticket {id} not found."
            });
        }

        var result =
            await _ticketService
                .IsCancellableAsync(id);

        return Ok(new
        {
            cancellable = result
        });
    }

    // =========================================================
    // CANCELLATION CONTEXT
    // GET /api/tickets/{id}/cancellation-context
    // =========================================================

    [HttpGet("{id:int}/cancellation-context")]
    public async Task<IActionResult>
        GetCancellationContext(int id)
    {
        if (id <= 0)
        {
            return BadRequest(new
            {
                success = false,
                message = "Ticket ID không hợp lệ."
            });
        }

        var result =
            await _ticketService
                .GetCancellationContextAsync(id);

        if (result == null)
        {
            return NotFound(new
            {
                success = false,
                message = "Không tìm thấy vé."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // CURRENT USER ID
    // =========================================================

    private int? GetCurrentUserId()
    {
        var claim =
            User.FindFirst(
                ClaimTypes.NameIdentifier);

        if (claim == null)
        {
            return null;
        }

        if (!int.TryParse(
                claim.Value,
                out var userId))
        {
            return null;
        }

        return userId > 0
            ? userId
            : null;
    }
}