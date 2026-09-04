using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin/tickets")]
[Authorize(Roles = "Admin")]
public class AdminTicketsController : ControllerBase
{
    private readonly ITicketService _ticketService;

    public AdminTicketsController(
        ITicketService ticketService)
    {
        _ticketService = ticketService;
    }

    // =====================================================
    // GET ALL TICKETS
    // GET /api/admin/tickets
    // =====================================================

    [HttpGet]
    [ProducesResponseType(
        typeof(IEnumerable<TicketResponse>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(
        StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetTickets()
    {
        var tickets =
            await _ticketService.GetAllAsync();

        return Ok(tickets);
    }


    // =====================================================
    // GET TICKET BY ID
    // GET /api/admin/tickets/{id}
    // =====================================================

    [HttpGet("{id:int}")]
    [ProducesResponseType(
        typeof(TicketResponse),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetTicketById(
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
            await _ticketService.GetByIdAsync(id);

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


    // =====================================================
    // GET TICKETS BY PNR
    // GET /api/admin/tickets/pnr/{pnr}
    // =====================================================

    [HttpGet("pnr/{pnr}")]
    [ProducesResponseType(
        typeof(IEnumerable<TicketResponse>),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetByPNR(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                success = false,
                message = "PNR không được để trống."
            });
        }

        var tickets =
            await _ticketService.GetByPNRAsync(pnr);

        if (!tickets.Any())
        {
            return NotFound(new
            {
                success = false,
                message = $"Không tìm thấy vé với PNR '{pnr}'."
            });
        }

        return Ok(tickets);
    }


    // =====================================================
    // CANCEL TICKET
    // PUT /api/admin/tickets/{id}/cancel
    // =====================================================

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
            var reason = string.IsNullOrWhiteSpace(request?.Reason)
                ? "Cancelled by user"
                : request.Reason.Trim();

            var result = await _ticketService.CancelAsync(
                pnr.Trim(),
                reason);

            if (!result)
            {
                return BadRequest(new
                {
                    success = false,
                    message = "Không thể hủy vé. PNR không tồn tại hoặc vé đã được hủy."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Hủy vé thành công.",
                pnr = pnr.Trim()
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


    // =====================================================
    // CHECK CANCELLABLE
    // GET /api/admin/tickets/{id}/cancellable
    // =====================================================

    [HttpGet("{id:int}/cancellable")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> IsCancellable(
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

        var result =
            await _ticketService.IsCancellableAsync(id);

        return Ok(new
        {
            ticketId = id,
            cancellable = result
        });
    }


    // =====================================================
    // GET CANCELLATION CONTEXT
    // GET /api/admin/tickets/{id}/cancellation-context
    // =====================================================

    [HttpGet("{id:int}/cancellation-context")]
    [ProducesResponseType(
        typeof(TicketResponse),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        StatusCodes.Status404NotFound)]
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


    // =====================================================
    // DELETE
    // DELETE /api/admin/tickets/{id}
    // =====================================================

    [HttpDelete("{id:int}")]
    [ProducesResponseType(
        typeof(ApiResponseDto),
        StatusCodes.Status200OK)]
    [ProducesResponseType(
        typeof(ApiResponseDto),
        StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DeleteTicket(
        int id)
    {
        if (id <= 0)
        {
            return BadRequest(new ApiResponseDto
            {
                Success = false,
                Message = "Ticket ID không hợp lệ."
            });
        }

        try
        {
            var result =
                await _ticketService.DeleteAsync(id);

            if (!result)
            {
                return NotFound(new ApiResponseDto
                {
                    Success = false,
                    Message = "Ticket not found."
                });
            }

            return Ok(new ApiResponseDto
            {
                Success = true,
                Message = "Ticket deleted successfully."
            });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new ApiResponseDto
            {
                Success = false,
                Message = ex.Message
            });
        }
    }
}