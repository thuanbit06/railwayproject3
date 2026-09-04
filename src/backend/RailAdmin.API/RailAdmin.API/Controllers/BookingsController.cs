using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Booking;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _service;

    public BookingsController(IBookingService service)
    {
        _service = service;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(result);
    }

    // =========================================================
    // GET BY PNR
    // =========================================================

    [HttpGet("{pnr}")]
    public async Task<IActionResult> GetByPNR(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                message = "PNR is required."
            });
        }

        var result =
            await _service.GetByPNRAsync(pnr.Trim());

        if (result == null)
        {
            return NotFound(new
            {
                message =
                    $"Booking with PNR '{pnr}' was not found."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // GET BY USER
    // =========================================================

    [HttpGet("user/{userId:int}")]
    public async Task<IActionResult> GetByUserId(int userId)
    {
        if (userId <= 0)
        {
            return BadRequest(new
            {
                message = "User ID must be greater than 0."
            });
        }

        var result =
            await _service.GetByUserIdAsync(userId);

        return Ok(result);
    }

    // =========================================================
    // CREATE
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] BookingCreateRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var result =
                await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetByPNR),
                new { pnr = result.PNR },
                result);
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
    // CANCEL BOOKING
    // =========================================================

    [HttpPut("{pnr}/cancel")]
    public async Task<IActionResult> Cancel(
        string pnr,
        [FromBody] CancelBookingRequest dto)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                message = "PNR is required."
            });
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var result =
                await _service.CancelAsync(
                    pnr.Trim(),
                    dto?.Reason ?? string.Empty);

            if (!result)
            {
                return NotFound(new
                {
                    message =
                        $"Booking with PNR '{pnr}' was not found."
                });
            }

            var booking =
                await _service.GetByPNRAsync(
                    pnr.Trim());

            return Ok(booking);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new
            {
                message = ex.Message
            });
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
    // UPDATE STATUS
    // =========================================================

    [HttpPut("{pnr}")]
    public async Task<IActionResult> Update(
        string pnr,
        [FromBody] BookingUpdateRequest dto)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                message = "PNR is required."
            });
        }

        if (!ModelState.IsValid)
        {
            return ValidationProblem(ModelState);
        }

        try
        {
            var updated =
                await _service.UpdateAsync(
                    pnr.Trim(),
                    dto);

            if (!updated)
            {
                return NotFound(new
                {
                    message =
                        $"Booking with PNR '{pnr}' was not found."
                });
            }

            var booking =
                await _service.GetByPNRAsync(
                    pnr.Trim());

            return Ok(booking);
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

    [HttpDelete("{pnr}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return BadRequest(new
            {
                message = "PNR is required."
            });
        }

        try
        {
            var deleted =
                await _service.DeleteAsync(
                    pnr.Trim());

            if (!deleted)
            {
                return NotFound(new
                {
                    message =
                        $"Booking with PNR '{pnr}' was not found."
                });
            }

            return Ok(new
            {
                message =
                    "Booking deleted successfully."
            });
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
}
