using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;

namespace RailAdmin.API.Controllers.Admin;

[ApiController]
[Route("api/admin/cancellation-rules")]
[Authorize(Roles = "Admin")] // Chỉ Admin mới được vào
public class CancellationRulesController : ControllerBase
{
    private readonly AppDbContext _db;
    public CancellationRulesController(AppDbContext db) => _db = db;

    // API 2: Lấy danh sách quy tắc
    [HttpGet]
    public async Task<IActionResult> GetRules()
    {
        var rules = await _db.CancellationRules.ToListAsync();
        return Ok(rules);
    }

    // API 2: Tạo quy tắc mới
    [HttpPost]
    public async Task<IActionResult> CreateRule([FromBody] CancellationRule rule)
    {
        _db.CancellationRules.Add(rule);
        await _db.SaveChangesAsync();
        return Ok(rule);
    }

    // API 2: Cập nhật quy tắc
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateRule(int id, [FromBody] CancellationRule rule)
    {
        var existing = await _db.CancellationRules.FindAsync(id);
        if (existing == null) return NotFound();
        existing.HoursBeforeDeparture = rule.HoursBeforeDeparture;
        existing.FeeValue = rule.FeeValue;
        existing.CancellationFeeType = rule.CancellationFeeType;
        existing.MinFee = rule.MinFee;
        await _db.SaveChangesAsync();
        return Ok(existing);
    }
}