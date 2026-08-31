using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Train;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/trains")]
[Authorize(Roles = "Admin")]
public class TrainsController : ControllerBase
{
    private readonly ITrainService _service;

    public TrainsController(ITrainService service)
    {
        _service = service;
    }

    // GET: api/trains
    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] TrainSearchRequest request)
    {
        var result = await _service.SearchAsync(request);

        return Ok(result);
    }

    // GET: api/trains/5
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);

        if (result == null)
        {
            return NotFound(new
            {
                success = false,
                message = $"Train with ID {id} not found."
            });
        }

        return Ok(result);
    }

    // POST: api/trains
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] TrainCreateRequest dto)
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

    // PUT: api/trains/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] TrainUpdateRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _service.UpdateAsync(id, dto);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message = $"Train with ID {id} not found."
            });
        }

        return NoContent();
    }

    // PATCH: api/trains/5/status
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] bool isActive)
    {
        var success = await _service.UpdateStatusAsync(id, isActive);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message = $"Train with ID {id} not found."
            });
        }

        return Ok(new
        {
            success = true,
            message = isActive
                ? "Train activated successfully."
                : "Train deactivated successfully.",
            id,
            isActive
        });
    }

    // DELETE: api/trains/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success = await _service.DeleteAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message = $"Train with ID {id} not found."
            });
        }

        return NoContent();
    }
}