using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AdminDashboardController : ControllerBase
{
    private readonly IAdminDashboardService _service;

    public AdminDashboardController(
        IAdminDashboardService service)
    {
        _service = service;
    }

    // =========================================================
    // GET: /api/admin/stats
    // =========================================================

    [HttpGet("stats")]
    public async Task<IActionResult> GetStats()
    {
        var result = await _service.GetDashboardAsync();

        return Ok(result);
    }

    // =========================================================
    // GET: /api/admin/reservations/recent?count=5
    // =========================================================

    [HttpGet("reservations/recent")]
    public async Task<IActionResult> GetRecentReservations(
        [FromQuery] int count = 5)
    {
        if (count <= 0)
            count = 5;

        if (count > 50)
            count = 50;

        var result =
            await _service.GetRecentReservationsAsync(count);

        return Ok(result);
    }
}