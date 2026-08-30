using RailAdmin.API.DTOs.Request.Seat;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class SeatService : ISeatService
{
    private readonly ISeatRepository _repo;

    public SeatService(ISeatRepository repo)
    {
        _repo = repo;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<SeatResponse>> GetAllAsync()
    {
        var list = await _repo.GetAllAsync();

        return list.Select(MapToResponse);
    }

    // =========================================================
    // GET BY COACH
    // =========================================================

    public async Task<IEnumerable<SeatResponse>> GetByCoachIdAsync(
        int coachId)
    {
        var list = await _repo.GetByCoachIdAsync(coachId);

        return list.Select(MapToResponse);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<SeatResponse?> GetByIdAsync(int id)
    {
        var item = await _repo.GetByIdAsync(id);

        return item == null
            ? null
            : MapToResponse(item);
    }

    // =========================================================
    // CREATE
    // =========================================================

    public async Task<SeatResponse> CreateAsync(
        SeatCreateRequest dto)
    {
        // -----------------------------------------------------
        // Check Coach
        // -----------------------------------------------------

        var coachExists =
            await _repo.CoachExistsAsync(dto.CoachId);

        if (!coachExists)
        {
            throw new KeyNotFoundException(
                $"Coach with ID {dto.CoachId} not found.");
        }

        // -----------------------------------------------------
        // Normalize SeatNo
        // -----------------------------------------------------

        var seatNo = dto.SeatNo.Trim().ToUpper();

        // -----------------------------------------------------
        // Check duplicate
        // -----------------------------------------------------

        var exists =
            await _repo.SeatNoExistsAsync(
                dto.CoachId,
                seatNo);

        if (exists)
        {
            throw new InvalidOperationException(
                $"Seat number '{seatNo}' already exists in this coach.");
        }

        // -----------------------------------------------------
        // Create
        // -----------------------------------------------------

        var seat = new Seat
        {
            CoachId = dto.CoachId,
            SeatNo = seatNo
        };

        var created =
            await _repo.CreateAsync(seat);

        return MapToResponse(created);
    }

    // =========================================================
    // UPDATE
    // =========================================================

    public async Task<bool> UpdateAsync(
        int id,
        SeatUpdateRequest dto)
    {
        var existing =
            await _repo.GetByIdAsync(id);

        if (existing == null)
            return false;

        var seatNo =
            dto.SeatNo.Trim().ToUpper();

        // -----------------------------------------------------
        // Check duplicate
        // -----------------------------------------------------

        var exists =
            await _repo.SeatNoExistsAsync(
                existing.CoachId,
                seatNo,
                id);

        if (exists)
        {
            throw new InvalidOperationException(
                $"Seat number '{seatNo}' already exists in this coach.");
        }

        // -----------------------------------------------------
        // Update
        // -----------------------------------------------------

        var seat = new Seat
        {
            Id = id,
            CoachId = existing.CoachId,
            SeatNo = seatNo
        };

        return await _repo.UpdateAsync(seat);
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        return await _repo.DeleteAsync(id);
    }

    // =========================================================
    // MAP
    // =========================================================

    private static SeatResponse MapToResponse(Seat s)
    {
        return new SeatResponse
        {
            Id = s.Id,
            CoachId = s.CoachId,
            SeatNo = s.SeatNo
        };
    }
}