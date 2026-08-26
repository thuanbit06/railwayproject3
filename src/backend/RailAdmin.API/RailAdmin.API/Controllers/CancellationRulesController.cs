using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Request.CancellationRule;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/cancellation-rules")]
[Authorize(Roles = "Admin")]
public class CancellationRulesController
    : ControllerBase
{
    private readonly ICancellationRuleService
        _cancellationRuleService;

    public CancellationRulesController(
        ICancellationRuleService cancellationRuleService)
    {
        _cancellationRuleService =
            cancellationRuleService;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var rules =
            await _cancellationRuleService.GetAllAsync();

        return Ok(rules);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var rule =
            await _cancellationRuleService.GetByIdAsync(id);

        if (rule == null)
        {
            return NotFound(new
            {
                message =
                    $"Cancellation rule {id} not found."
            });
        }

        return Ok(rule);
    }

    // =========================================================
    // GET APPLICABLE RULE
    // =========================================================

    [HttpGet("applicable")]
    public async Task<IActionResult> GetApplicableRule(
        [FromQuery] int hoursBeforeDeparture)
    {
        var rule =
            await _cancellationRuleService
                .GetApplicableRuleAsync(
                    hoursBeforeDeparture);

        if (rule == null)
        {
            return NotFound(new
            {
                message =
                    "No applicable cancellation rule found."
            });
        }

        return Ok(rule);
    }

    // =========================================================
    // CREATE
    // =========================================================

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] CancellationRuleCreateRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var created =
            await _cancellationRuleService
                .CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = created.Id },
            created);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] CancellationRuleUpdateRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var updated =
            await _cancellationRuleService
                .UpdateAsync(id, dto);

        if (!updated)
        {
            return NotFound(new
            {
                message =
                    $"Cancellation rule {id} not found."
            });
        }

        return NoContent();
    }

    // =========================================================
    // DELETE
    // =========================================================

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted =
            await _cancellationRuleService
                .DeleteAsync(id);

        if (!deleted)
        {
            return NotFound(new
            {
                message =
                    $"Cancellation rule {id} not found."
            });
        }

        return NoContent();
    }

    [HttpPost("calculate")]
    public async Task<IActionResult> CalculateCancellation(
    [FromBody] CancellationCalculationRequest dto)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var result =
            await _cancellationRuleService
                .CalculateCancellationAsync(
                    dto.TicketId,
                    dto.PNR,
                    dto.AmountPaid,
                    dto.DepartureTime);

        return Ok(result);
    }
}