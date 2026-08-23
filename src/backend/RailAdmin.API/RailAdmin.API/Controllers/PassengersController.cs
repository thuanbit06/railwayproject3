
using Microsoft.AspNetCore.Mvc;
using RailAdmin.API.DTOs.Passenger;
using RailAdmin.API.Services;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/passengers")]
public class PassengersController : ControllerBase
{
    private readonly IPassengerService _service;

    public PassengersController(IPassengerService service)
    {
        _service = service;
    }

    // GET: api/passengers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<PassengerDto>>> GetAll()
    {
        var passengers = await _service.GetAllAsync();

        return Ok(passengers);
    }

    // GET: api/passengers/1
    [HttpGet("{id:int}")]
    public async Task<ActionResult<PassengerDto>> GetById(int id)
    {
        var passenger = await _service.GetByIdAsync(id);

        if (passenger == null)
            return NotFound(new
            {
                message = "Passenger not found"
            });

        return Ok(passenger);
    }

    // POST: api/passengers
    [HttpPost]
    public async Task<ActionResult<PassengerDto>> Create(
        [FromBody] CreatePassengerDto dto)
    {
        var passenger = await _service.CreateAsync(dto);

        return CreatedAtAction(
            nameof(GetById),
            new { id = passenger.Id },
            passenger
        );
    }

    // PUT: api/passengers/1
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] UpdatePassengerDto dto)
    {
        var result = await _service.UpdateAsync(id, dto);

        if (!result)
            return NotFound(new
            {
                message = "Passenger not found"
            });

        return NoContent();
    }

    // DELETE: api/passengers/1
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);

        if (!result)
            return NotFound(new
            {
                message = "Passenger not found"
            });

        return NoContent();
    }
}

