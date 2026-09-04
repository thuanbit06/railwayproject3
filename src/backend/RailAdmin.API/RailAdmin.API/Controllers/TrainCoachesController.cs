using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.Coach;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/train-coaches")]
[Authorize(Roles = "Admin")]
public class TrainCoachesController : ControllerBase
{
    private readonly ITrainCoachService _service;

    public TrainCoachesController(
        ITrainCoachService service)
    {
        _service = service;
    }

    // =========================================================
    // GET: api/train-coaches
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result =
            await _service.GetAllAsync();

        return Ok(result);
    }

    // =========================================================
    // GET: api/train-coaches/train/5
    // =========================================================

    [HttpGet("train/{trainId:int}")]
    public async Task<IActionResult> GetByTrainId(
        int trainId)
    {
        var result =
            await _service.GetByTrainIdAsync(trainId);

        return Ok(result);
    }

    // =========================================================
    // GET: api/train-coaches/5
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(
        int id)
    {
        var result =
            await _service.GetByIdAsync(id);

        if (result == null)
        {
            return NotFound(new
            {
                success = false,
                message =
                    $"Train coach with ID {id} not found."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // POST: api/train-coaches
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] TrainCoachCreateRequest dto)
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
                created
            );
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
    // PUT: api/train-coaches/5
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] TrainCoachUpdateRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success =
            await _service.UpdateAsync(id, dto);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message =
                    $"Train coach with ID {id} not found."
            });
        }

        return NoContent();
    }

    // =========================================================
    // DELETE: api/train-coaches/5
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(
        int id)
    {
        var success =
            await _service.DeleteAsync(id);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message =
                    $"Train coach with ID {id} not found."
            });
        }

        return NoContent();
    }
}