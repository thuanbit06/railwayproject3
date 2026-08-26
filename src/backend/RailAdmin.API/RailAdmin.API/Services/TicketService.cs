using System;
using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;      

namespace RailAdmin.API.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;

    public TicketService(ITicketRepository ticketRepository)
    {
        _ticketRepository = ticketRepository;
    }

    public async Task<IEnumerable<TicketResponse>> GetAllAsync()
    {
        var tickets = await _ticketRepository.GetAllAsync();

        return tickets.Select(MapToResponse);
    }

    public async Task<IEnumerable<TicketResponse>> GetByPNRAsync(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException("PNR is required.", nameof(pnr));
        }

        var tickets = await _ticketRepository.GetByPNRAsync(pnr);

        return tickets.Select(MapToResponse);
    }

    public async Task<TicketResponse?> GetByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException("Ticket ID must be greater than 0.", nameof(id));
        }

        var ticket = await _ticketRepository.GetByIdAsync(id);

        return ticket == null
            ? null
            : MapToResponse(ticket);
    }

    public async Task<TicketResponse> CreateAsync(TicketCreateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (string.IsNullOrWhiteSpace(dto.PNR))
        {
            throw new ArgumentException("PNR is required.", nameof(dto.PNR));
        }

        if (string.IsNullOrWhiteSpace(dto.PassengerName))
        {
            throw new ArgumentException(
                "Passenger name is required.",
                nameof(dto.PassengerName));
        }

        if (dto.Age < 0)
        {
            throw new ArgumentException(
                "Passenger age cannot be negative.",
                nameof(dto.Age));
        }

        if (dto.Fare < 0)
        {
            throw new ArgumentException(
                "Fare cannot be negative.",
                nameof(dto.Fare));
        }

        var ticket = new Ticket
        {
            PNR = dto.PNR.Trim(),
            SeatId = dto.SeatId,
            PassengerName = dto.PassengerName.Trim(),
            Age = dto.Age,
            Gender = dto.Gender,
            Fare = dto.Fare,

            Status = dto.SeatId.HasValue
                ? "Confirmed"
                : "Waiting"
        };

        var createdTicket = await _ticketRepository.CreateAsync(ticket);

        return MapToResponse(createdTicket);
    }

    public async Task<bool> UpdateAsync(
        int id,
        TicketUpdateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (id <= 0)
        {
            throw new ArgumentException(
                "Ticket ID must be greater than 0.",
                nameof(id));
        }

        var existingTicket = await _ticketRepository.GetByIdAsync(id);

        if (existingTicket == null)
        {
            return false;
        }

        existingTicket.SeatId = dto.SeatId;
        existingTicket.Status = dto.Status;
        existingTicket.CancelReason = dto.CancelReason;

        if (dto.Status?.Equals(
                "Cancelled",
                StringComparison.OrdinalIgnoreCase) == true)
        {
            existingTicket.CancelledAt =
                existingTicket.CancelledAt ?? DateTime.UtcNow;
        }
        else
        {
            existingTicket.CancelledAt = null;
            existingTicket.CancelReason = null;
        }

        return await _ticketRepository.UpdateAsync(existingTicket);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Ticket ID must be greater than 0.",
                nameof(id));
        }

        var existingTicket = await _ticketRepository.GetByIdAsync(id);

        if (existingTicket == null)
        {
            return false;
        }

        return await _ticketRepository.DeleteAsync(id);
    }

    private static TicketResponse MapToResponse(Ticket ticket)
    {
        return new TicketResponse
        {
            Id = ticket.Id,
            PNR = ticket.PNR,
            SeatId = ticket.SeatId,
            PassengerName = ticket.PassengerName,
            Age = ticket.Age,
            Gender = ticket.Gender,
            Fare = ticket.Fare,
            Status = ticket.Status,
            CancelReason = ticket.CancelReason,
            CancelledAt = ticket.CancelledAt
        };
    }
}