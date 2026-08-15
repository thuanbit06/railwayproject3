using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using static System.Collections.Specialized.BitVector32;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin/stations")]
[Authorize(Roles = "Admin")]
public class StationsController : ControllerBase
{
    private readonly AppDbContext _db;

    public StationsController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _db.Stations.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(Station s)
    {
        _db.Stations.Add(s);
        await _db.SaveChangesAsync();

        return Ok(s);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, Station s)
    {
        if (id != s.Id)
            return BadRequest();

        _db.Entry(s).State = EntityState.Modified;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var s = await _db.Stations.FindAsync(id);

        if (s == null)
            return NotFound();

        _db.Stations.Remove(s);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}