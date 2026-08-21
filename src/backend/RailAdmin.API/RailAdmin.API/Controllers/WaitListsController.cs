using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;

namespace RailAdmin.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WaitListsController : ControllerBase
    {
        private readonly AppDbContext _db;

        public WaitListsController(AppDbContext db)
        {
            _db = db;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<WaitList>>> GetAll()
            => await _db.WaitLists.ToListAsync();

        [HttpGet("{id}")]
        public async Task<ActionResult<WaitList>> GetById(int id)
        {
            var item = await _db.WaitLists.FindAsync(id);
            return item == null ? NotFound() : Ok(item);
        }

        [HttpPost]
        public async Task<ActionResult<WaitList>> Create(WaitList dto)
        {
            _db.WaitLists.Add(dto);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = dto.Id }, dto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, WaitList dto)
        {
            if (id != dto.Id) return BadRequest();
            _db.Entry(dto).State = EntityState.Modified;
            await _db.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var item = await _db.WaitLists.FindAsync(id);
            if (item == null) return NotFound();
            _db.WaitLists.Remove(item);
            await _db.SaveChangesAsync();
            return NoContent();
        }
    }
}
