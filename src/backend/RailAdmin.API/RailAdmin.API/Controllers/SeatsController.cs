using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Seat;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/seats")]
[Authorize(Roles = "Admin")]
public class SeatsController : ControllerBase
{
    private readonly ISeatService _service;

    public SeatsController(ISeatService service)
    {
        _service = service;
    }

    // =========================================================
    // GET: api/seats
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(result);
    }

    // =========================================================
    // GET: api/seats/coach/5
    // =========================================================

    [HttpGet("coach/{coachId:int}")]
    public async Task<IActionResult> GetByCoachId(
        int coachId)
    {
        var result =
            await _service.GetByCoachIdAsync(coachId);

        return Ok(result);
    }

    // =========================================================
    // GET: api/seats/5
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result =
            await _service.GetByIdAsync(id);

        if (result == null)
        {
            return NotFound(new
            {
                success = false,
                message = $"Seat with ID {id} not found."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // POST: api/seats
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] SeatCreateRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var created =
                await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created);
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

    // =========================================================
    // PUT: api/seats/5
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] SeatUpdateRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var success =
                await _service.UpdateAsync(id, dto);

            if (!success)
            {
                return NotFound(new
                {
                    success = false,
                    message =
                        $"Seat with ID {id} not found."
                });
            }

            return NoContent();
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

    // =========================================================
    // DELETE: api/seats/5
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var success =
            await _service.DeleteAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message =
                    $"Seat with ID {id} not found."
            });
        }

        return NoContent();
    }
}