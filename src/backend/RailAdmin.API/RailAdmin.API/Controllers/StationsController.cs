using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Station;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/stations")]
[Authorize(Roles = "Admin")]
public class StationsController : ControllerBase
{
    private readonly IStationService _service;

    public StationsController(IStationService service)
    {
        _service = service;
    }

    // =========================================================
    // GET: api/stations
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(result);
    }

    // =========================================================
    // GET: api/stations/5
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
                message = $"Station with ID {id} not found."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // POST: api/stations
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] StationCreateRequest dto)
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
    // PUT: api/stations/5
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] StationUpdateRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _service.UpdateAsync(id, dto);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message = $"Station with ID {id} not found."
            });
        }

        return NoContent();
    }

    // =========================================================
    // DELETE: api/stations/5
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
                message = $"Station with ID {id} not found."
            });
        }

        return NoContent();
    }
}