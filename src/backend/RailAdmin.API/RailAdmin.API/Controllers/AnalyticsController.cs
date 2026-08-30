using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin")]
[Authorize(Roles = "Admin")]
public class AnalyticsController : ControllerBase
{
    private readonly IAnalyticsService _service;

    public AnalyticsController(IAnalyticsService service)
    {
        _service = service;
    }

    // =========================================================
    // GET: /api/admin/analytics?range=Month
    // =========================================================

    [HttpGet("analytics")]
    public async Task<IActionResult> GetAnalytics(
        [FromQuery] string range = "Month")
    {
        if (string.IsNullOrWhiteSpace(range))
        {
            range = "Month";
        }

        range = range.Trim();

        if (!new[] { "Week", "Month", "Year" }
            .Contains(range, StringComparer.OrdinalIgnoreCase))
        {
            return BadRequest(new
            {
                message = "Range must be Week, Month or Year."
            });
        }

        var result =
            await _service.GetAnalyticsAsync(range);

        return Ok(result);
    }
}