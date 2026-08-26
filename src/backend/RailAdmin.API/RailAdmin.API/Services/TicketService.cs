using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _repo;
    public TicketService(ITicketRepository repo, ITicketRepository repoReal) { _repo = repoReal; }
    public TicketService(ITicketRepository repo) { _repo = repo; }

    public async Task<IEnumerable<TicketResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();
        return list.Select(MapToResponse);
    }

    public async Task<IEnumerable<TicketResponse>> GetByPNRAsync(string pnr)
    {
        var list = await _repo.GetByPNRAsync(pnr);
        return list.Select(MapToResponse);
    }

    public async Task<TicketResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);
        return item == null ? null : MapToResponse(item);
    }

    public async Task<TicketResponse> CreateAsync(TicketCreateRequest dto)
    {
        var ticket = new Ticket
        {
            PNR = dto.PNR,
            SeatId = dto.SeatId,
            PassengerName = dto.PassengerName,
            Age = dto.Age,
            Gender = dto.Gender,
            Fare = dto.Fare,
            Status = dto.SeatId.HasValue ? "Confirmed" : "Waiting"
        };
        var created = await _repo.CreateAsync(ticket);
        return MapToResponse(created);
    }

    public async Task<bool> UpdateAsync(int id, TicketUpdateRequest dto)
    {
        var ticket = new Ticket
        {
            Id = id,
            SeatId = dto.SeatId,
            Status = dto.Status,
            CancelReason = dto.CancelReason
        };
        return await _repo.UpdateAsync(ticket);
    }

    public async Task<bool> DeleteAsync(int id) => await _repo.DeleteAsync(id);

    private static TicketResponse MapToResponse(Ticket t) => new()
    {
        Id = t.Id,
        PNR = t.PNR,
        SeatId = t.SeatId,
        PassengerName = t.PassengerName,
        Age = t.Age,
        Gender = t.Gender,
        Fare = t.Fare,
        Status = t.Status,
        CancelReason = t.CancelReason,
        CancelledAt = t.CancelledAt
    };
}