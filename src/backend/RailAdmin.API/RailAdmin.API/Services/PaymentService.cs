using RailAdmin.API.DTOs.Request.Payment;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class PaymentService : IPaymentService
{
    private readonly IPaymentRepository _repo;
    public PaymentService(IPaymentRepository repo) { _repo = repo; }

    public async Task<IEnumerable<PaymentResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<PaymentResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<PaymentResponse?> GetByPNRAsync(string pnr)
    {
        var item = await _repo.GetByPNRAsync(pnr);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<PaymentResponse> CreateAsync(PaymentCreateRequest dto)
    {
        var payment = new Payment
        {
            PNR = dto.PNR,
            Amount = dto.Amount,
            Method = dto.Method,
            Status = "Success",
            TransactionId = "TXN_" + Guid.NewGuid().ToString("N")[..12].ToUpper(),
            PaidAt = DateTime.UtcNow
        };
        var created = await _repo.CreateAsync(payment);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, PaymentUpdateRequest dto)
    {
        var payment = new Payment
        {
            Id = id,
            Status = dto.Status,
            TransactionId = dto.TransactionId
        };
        return await _repo.UpdateAsync(payment);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static PaymentResponse MapToResponse(Payment p) => new()
    {
        Id = p.Id,
        PNR = p.PNR,
        Amount = p.Amount,
        Method = p.Method,
        Status = p.Status,
        TransactionId = p.TransactionId,
        PaidAt = p.PaidAt
    };
}