using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Seat;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/seats")]
[Authorize(Roles = "Admin")]
public class SeatsController : ControllerBase
{
    private readonly ISeatService _seatService;

    public SeatsController(ISeatService seatService)
    {
        _seatService = seatService;
    }

    // =========================================================
    // GET ALL
    // GET /api/seats
    // =========================================================

    [HttpGet]
    public async Task<ActionResult<IEnumerable<SeatResponse>>> GetAll()
    {
        var seats = await _seatService.GetAllAsync();
        return Ok(seats);
    }

    // =========================================================
    // GET BY ID
    // GET /api/seats/{id}
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<ActionResult<SeatResponse>> GetById(int id)
    {
        if (id <= 0)
            return BadRequest("Seat ID must be greater than 0.");

        var seat = await _seatService.GetByIdAsync(id);

        if (seat == null)
            return NotFound($"Seat with ID {id} was not found.");

        return Ok(seat);
    }

    // =========================================================
    // GET BY COACH
    // GET /api/seats/coach/{coachId}
    // =========================================================

    [HttpGet("coach/{coachId:int}")]
    public async Task<ActionResult<IEnumerable<SeatResponse>>> GetByCoachId(int coachId)
    {
        if (coachId <= 0)
            return BadRequest("Coach ID must be greater than 0.");

        var seats = await _seatService.GetByCoachIdAsync(coachId);
        return Ok(seats);
    }

    // =========================================================
    // CREATE
    // POST /api/seats
    // =========================================================

    [HttpPost]
    public async Task<ActionResult<SeatResponse>> Create([FromBody] SeatCreateRequest dto)
    {
        if (dto == null)
            return BadRequest("Request body is required.");

        try
        {
            var created = await _seatService.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created);
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // =========================================================
    // UPDATE
    // PUT /api/seats/{id}
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, [FromBody] SeatUpdateRequest dto)
    {
        if (id <= 0)
            return BadRequest("Seat ID must be greater than 0.");

        if (dto == null)
            return BadRequest("Request body is required.");

        try
        {
            var updated = await _seatService.UpdateAsync(id, dto);

            if (!updated)
                return NotFound($"Seat with ID {id} was not found.");

            return NoContent();
        }
        catch (ArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    // =========================================================
    // DELETE
    // DELETE /api/seats/{id}
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        if (id <= 0)
            return BadRequest("Seat ID must be greater than 0.");

        try
        {
            var deleted = await _seatService.DeleteAsync(id);

            if (!deleted)
                return NotFound($"Seat with ID {id} was not found.");

            return NoContent();
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}