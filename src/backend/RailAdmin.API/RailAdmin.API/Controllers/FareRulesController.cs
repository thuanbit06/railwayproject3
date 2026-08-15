using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/admin/fare-rules")]
[Authorize(Roles = "Admin")]
public class FareRulesController : ControllerBase
{
    private readonly AppDbContext _db;

    public FareRulesController(AppDbContext db)
    {
        _db = db;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        return Ok(await _db.FareRules.ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> Create(FareRule r)
    {
        _db.FareRules.Add(r);

        await _db.SaveChangesAsync();

        return Ok(r);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, FareRule r)
    {
        if (id != r.Id)
            return BadRequest();

        _db.Entry(r).State = EntityState.Modified;

        await _db.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var r = await _db.FareRules.FindAsync(id);

        if (r == null)
            return NotFound();

        _db.FareRules.Remove(r);

        await _db.SaveChangesAsync();

        return NoContent();
    }
}