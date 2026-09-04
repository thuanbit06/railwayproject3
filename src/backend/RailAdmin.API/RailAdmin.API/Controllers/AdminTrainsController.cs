using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Train;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin/trains")]
[Authorize(Roles = "Admin")]
public class AdminTrainsController : ControllerBase
{
    private readonly ITrainService _service;

    public AdminTrainsController(
        ITrainService service)
    {
        _service = service;
    }

    // GET /api/admin/trains
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(result);
    }

    // GET /api/admin/trains/search?keyword=SE1
    [HttpGet("search")]
    public async Task<IActionResult> Search(
        [FromQuery] TrainSearchRequest request)
    {
        var result = await _service.SearchAsync(request);

        return Ok(result);
    }

    // GET /api/admin/trains/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);

        if (result == null)
        {
            return NotFound(new
            {
                message = "Train not found."
            });
        }

        return Ok(result);
    }

    // POST /api/admin/trains
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] TrainCreateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var result =
                await _service.CreateAsync(request);

            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Id },
                result);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new
            {
                message = ex.Message
            });
        }
    }

    // PUT /api/admin/trains/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] TrainUpdateRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var success =
                await _service.UpdateAsync(id, request);

            if (!success)
            {
                return NotFound(new
                {
                    message = "Train not found."
                });
            }

            return Ok(new
            {
                success = true,
                message = "Train updated successfully."
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

    // DELETE /api/admin/trains/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success =
            await _service.DeleteAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                message = "Train not found."
            });
        }

        return Ok(new
        {
            success = true,
            message = "Train deleted successfully."
        });
    }

    // PATCH /api/admin/trains/1/status
    [HttpPatch("{id:int}/status")]
    public async Task<IActionResult> UpdateStatus(
        int id,
        [FromBody] bool isActive)
    {
        var success =
            await _service.UpdateStatusAsync(
                id,
                isActive);

        if (!success)
        {
            return NotFound(new
            {
                message = "Train not found."
            });
        }

        return Ok(new
        {
            success = true,
            message = isActive
                ? "Train activated."
                : "Train deactivated."
        });
    }
}