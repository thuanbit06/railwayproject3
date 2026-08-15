using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs;

namespace RailAdmin.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TrainsController : ControllerBase
{
    private readonly AppDbContext _context;

    public TrainsController(AppDbContext context)
    {
        _context = context;
    }

    // GET: api/trains/search?from=Hà Nội&to=Đà Nẵng&date=2024-10-24
    [HttpGet("search")]
    public async Task<IActionResult> SearchTrains(
        [FromQuery] string from,
        [FromQuery] string to,
        [FromQuery] DateTime date)
    {
        var trains = await _context.Trains
            .Where(t =>
                t.FromStation.Contains(from) &&
                t.ToStation.Contains(to))
            .Select(t => new TrainDto
            {
                Id = t.Id,
                TrainNo = t.TrainNo,
                TrainName = t.TrainName,
                FromStation = t.FromStation,
                ToStation = t.ToStation,
                DepartureTime = t.DepartureTime.ToString(@"hh\:mm"),
                ArrivalTime = t.ArrivalTime.ToString(@"hh\:mm"),
                Status = t.Status
            })
            .ToListAsync();

        return Ok(trains);
    }

    // GET: api/trains/5
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTrain(int id)
    {
        var train = await _context.Trains.FindAsync(id);

        if (train == null)
            return NotFound();

        return Ok(train);
    }
}