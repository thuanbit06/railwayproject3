using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;

public class PassengersController : ControllerBase
{
    private readonly AppDbContext _db;

    public PassengersController(AppDbContext db)
    {
        _db = db;
    }

    // GET: api/passengers
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Passenger>>> GetAll()
    {
        return await _db.Passengers.ToListAsync();
    }

    // GET: api/passengers/1
    [HttpGet("{id}")]
    public async Task<ActionResult<Passenger>> GetById(int id)
    {
        var passenger = await _db.Passengers.FindAsync(id);
        if (passenger == null)
            return NotFound();
        return Ok(passenger);
    }

    // POST: api/passengers
    [HttpPost]
    public async Task<ActionResult<Passenger>> Create(Passenger passenger)
    {
        _db.Passengers.Add(passenger);
        await _db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetById), new { id = passenger.Id }, passenger);
    }

    // PUT: api/passengers/1
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Passenger updated)
    {
        if (id != updated.Id)
            return BadRequest();

        _db.Entry(updated).State = EntityState.Modified;
        await _db.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/passengers/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var passenger = await _db.Passengers.FindAsync(id);
        if (passenger == null)
            return NotFound();

        _db.Passengers.Remove(passenger);
        await _db.SaveChangesAsync();
        return NoContent();
    }
}