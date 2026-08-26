using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class RefundService : IRefundService
{
    private readonly IRefundRepository _repo;
    public RefundService(IRefundRepository repo) { _repo = repo; }

    public async Task<IEnumerable<RefundResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<RefundResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<RefundResponse?> GetByTicketIdAsync(int ticketId)
    {
        var item = await _repo.GetByTicketIdAsync(ticketId);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<RefundResponse> CreateAsync(RefundCreateRequest dto)
    {
        decimal refundAmount = dto.AmountPaid - dto.CancellationFee;
        var refund = new Refund
        {
            TicketId = dto.TicketId,
            CancellationRuleId = dto.CancellationRuleId,
            AmountPaid = dto.AmountPaid,
            CancellationFee = dto.CancellationFee,
            RefundAmount = refundAmount > 0 ? refundAmount : 0,
            RefundStatus = "PROCESSED",
            RefundDate = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(refund);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, RefundUpdateRequest dto)
    {
        var refund = new Refund
        {
            Id = id,
            RefundStatus = dto.RefundStatus
        };
        return await _repo.UpdateAsync(refund);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static RefundResponse MapToResponse(Refund r) => new()
    {
        Id = r.Id,
        TicketId = r.TicketId,
        CancellationRuleId = r.CancellationRuleId,
        AmountPaid = r.AmountPaid,
        CancellationFee = r.CancellationFee,
        RefundAmount = r.RefundAmount,
        RefundStatus = r.RefundStatus,
        RefundDate = r.RefundDate
    };
}