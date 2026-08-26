using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Booking;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/bookings")]
[Authorize(Roles = "Admin")]
public class BookingsController : ControllerBase
{
    private readonly IBookingService _bookingService;

    public BookingsController(
        IBookingService bookingService)
    {
        _bookingService = bookingService;
    }

    // GET: api/bookings
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var bookings =
            await _bookingService.GetAllAsync();

        return Ok(bookings);
    }

    // GET: api/bookings/{pnr}
    [HttpGet("{pnr}")]
    public async Task<IActionResult> GetByPNR(
        string pnr)
    {
        var booking =
            await _bookingService.GetByPNRAsync(pnr);

        if (booking == null)
        {
            return NotFound(new
            {
                message =
                    $"Booking with PNR '{pnr}' was not found."
            });
        }

        return Ok(booking);
    }

    // GET: api/bookings/user/{userId}
    [HttpGet("user/{userId:int}")]
    public async Task<IActionResult> GetByUserId(
        int userId)
    {
        var bookings =
            await _bookingService.GetByUserIdAsync(userId);

        return Ok(bookings);
    }

    // POST: api/bookings
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] BookingCreateRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var created =
            await _bookingService.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetByPNR),
            new { pnr = created.PNR },
            created
        );
    }

    // PATCH: api/bookings/{pnr}/status
    [HttpPatch("{pnr}/status")]
    public async Task<IActionResult> UpdateStatus(
        string pnr,
        [FromBody] BookingUpdateRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated =
            await _bookingService.UpdateStatusAsync(
                pnr,
                dto);

        if (!updated)
        {
            return NotFound(new
            {
                message =
                    $"Booking with PNR '{pnr}' was not found."
            });
        }

        return NoContent();
    }

    // POST: api/bookings/{pnr}/cancel
    [HttpPost("{pnr}/cancel")]
    public async Task<IActionResult> Cancel(
        string pnr)
    {
        var cancelled =
            await _bookingService.CancelAsync(pnr);

        if (!cancelled)
        {
            return NotFound(new
            {
                message =
                    $"Booking with PNR '{pnr}' was not found."
            });
        }

        return NoContent();
    }
}