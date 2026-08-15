using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin/reservations")]
[Authorize(Roles = "Admin")]
public class ReservationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public ReservationsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _db.Bookings.ToListAsync());
    }

    [HttpPut("{id}/confirm")]
    public async Task<IActionResult> Confirm(int id)
    {
        var b = await _db.Bookings.FindAsync(id);

        if (b == null)
            return NotFound();

        b.Status = "Confirmed";

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpPut("{id}/cancel")]
    public async Task<IActionResult> Cancel(int id)
    {
        var b = await _db.Bookings.FindAsync(id);

        if (b == null)
            return NotFound();

        b.Status = "Cancelled";

        await _db.SaveChangesAsync();

        return NoContent();
    }
}