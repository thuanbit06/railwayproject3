using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.TripStop;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/trip-stops")]
[Authorize(Roles = "Admin")]
public class TripStopsController : ControllerBase
{
    private readonly ITripStopService _service;

    public TripStopsController(ITripStopService service)
    {
        _service = service;
    }

    // =========================================================
    // GET: api/trip-stops
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(result);
    }

    // =========================================================
    // GET: api/trip-stops/trip/5
    // =========================================================

    [HttpGet("trip/{tripId:int}")]
    public async Task<IActionResult> GetByTripId(int tripId)
    {
        var result = await _service.GetByTripIdAsync(tripId);

        return Ok(result);
    }

    // =========================================================
    // GET: api/trip-stops/5
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);

        if (result == null)
        {
            return NotFound(new
            {
                success = false,
                message = $"Trip stop with ID {id} not found."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // POST: api/trip-stops
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] TripStopCreateRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            created
        );
    }

    // =========================================================
    // PUT: api/trip-stops/5
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] TripStopUpdateRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _service.UpdateAsync(id, dto);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message = $"Trip stop with ID {id} not found."
            });
        }

        return NoContent();
    }

    // =========================================================
    // DELETE: api/trip-stops/5
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message = $"Trip stop with ID {id} not found."
            });
        }

        return NoContent();
    }
}