using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.FareRule;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/fare-rules")]
[Authorize(Roles = "Admin")]
public class FareRulesController : ControllerBase
{
    private readonly IFareRuleService _service;

    public FareRulesController(IFareRuleService service)
    {
        _service = service;
    }

    // =========================================================
    // GET ALL
    // GET: api/fare-rules
    // =========================================================
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();

        return Ok(result);
    }

    // =========================================================
    // GET BY ID
    // GET: api/fare-rules/5
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
                message = $"Fare rule with ID {id} not found."
            });
        }

        return Ok(result);
    }

    // =========================================================
    // CREATE
    // POST: api/fare-rules
    // =========================================================
    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] FareRuleCreateRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var created = await _service.CreateAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id = created.Id },
                created
            );
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
    // UPDATE
    // PUT: api/fare-rules/5
    // =========================================================
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] FareRuleUpdateRequest dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var success = await _service.UpdateAsync(id, dto);

        if (!success)
        {
            return NotFound(new
            {
                success = false,
                message = $"Fare rule with ID {id} not found."
            });
        }

        return NoContent();
    }

    // =========================================================
    // DELETE
    // DELETE: api/fare-rules/5
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
                message = $"Fare rule with ID {id} not found."
            });
        }

        return NoContent();
    }
}