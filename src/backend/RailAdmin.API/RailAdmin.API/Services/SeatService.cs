using RailAdmin.API.DTOs.Request.Seat;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class SeatService : ISeatService
{
    private readonly ISeatRepository _seatRepository;

    public SeatService(ISeatRepository seatRepository)
    {
        _seatRepository = seatRepository;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<SeatResponse>> GetAllAsync()
    {
        var seats = await _seatRepository.GetAllAsync();
        return seats.Select(MapToResponse);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<SeatResponse?> GetByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Seat ID must be greater than 0.",
                nameof(id));
        }

        var seat = await _seatRepository.GetByIdAsync(id);

        if (seat == null)
            return null;

        return MapToResponse(seat);
    }

    // =========================================================
    // GET BY COACH
    // =========================================================

    public async Task<IEnumerable<SeatResponse>> GetByCoachIdAsync(int coachId)
    {
        if (coachId <= 0)
            return Enumerable.Empty<SeatResponse>();

        var seats = await _seatRepository.GetByCoachIdAsync(coachId);
        return seats.Select(MapToResponse);
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<SeatResponse> CreateAsync(SeatCreateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (dto.CoachId <= 0)
        {
            throw new ArgumentException(
                "CoachId must be greater than 0.",
                nameof(dto.CoachId));
        }

        if (string.IsNullOrWhiteSpace(dto.SeatNo))
        {
            throw new ArgumentException(
                "SeatNo is required.",
                nameof(dto.SeatNo));
        }

        var seat = new Seat
        {
            CoachId = dto.CoachId,
            SeatNo = dto.SeatNo.Trim(),
            BerthType = string.IsNullOrWhiteSpace(dto.BerthType)
                ? null
                : dto.BerthType.Trim()
        };

        var created = await _seatRepository.AddAsync(seat);

        // Load lại để lấy navigation Coach
        var fullSeat = await _seatRepository.GetByIdAsync(created.Id);

        return MapToResponse(fullSeat ?? created);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<bool> UpdateAsync(int id, SeatUpdateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (id <= 0)
        {
            throw new ArgumentException(
                "Seat ID must be greater than 0.",
                nameof(id));
        }

        if (dto.CoachId <= 0)
        {
            throw new ArgumentException(
                "CoachId must be greater than 0.",
                nameof(dto.CoachId));
        }

        if (string.IsNullOrWhiteSpace(dto.SeatNo))
        {
            throw new ArgumentException(
                "SeatNo is required.",
                nameof(dto.SeatNo));
        }

        var existing = await _seatRepository.GetByIdAsync(id);

        if (existing == null)
            return false;

        existing.CoachId = dto.CoachId;
        existing.SeatNo = dto.SeatNo.Trim();
        existing.BerthType = string.IsNullOrWhiteSpace(dto.BerthType)
            ? null
            : dto.BerthType.Trim();

        return await _seatRepository.UpdateAsync(existing);
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Seat ID must be greater than 0.",
                nameof(id));
        }

        return await _seatRepository.DeleteAsync(id);
    }

    // =========================================================
    // CHECK METHODS (dùng cho TicketService)
    // =========================================================

    public async Task<bool> SeatExistsAsync(int seatId)
    {
        return await _seatRepository.SeatExistsAsync(seatId);
    }

    public async Task<bool> SeatBelongsToTripAsync(int seatId, string pnr)
    {
        return await _seatRepository.SeatBelongsToTripAsync(seatId, pnr);
    }

    public async Task<bool> SeatIsAlreadyBookedAsync(int seatId, string pnr)
    {
        return await _seatRepository.SeatIsAlreadyBookedAsync(seatId, pnr);
    }

    // =========================================================
    // MAP
    // =========================================================

    private static SeatResponse MapToResponse(Seat seat)
    {
        return new SeatResponse
        {
            Id = seat.Id,
            CoachId = seat.CoachId,
            SeatNo = seat.SeatNo,
            BerthType = seat.BerthType,

            CoachNo = seat.Coach?.CoachNo ?? "N/A",
            ClassType = seat.Coach?.ClassType ?? "N/A",
            TrainId = seat.Coach?.TrainId
        };
    }
}