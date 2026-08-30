using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;

namespace RailAdmin.API.Repository;

public class TicketRepository : ITicketRepository
{
    private readonly AppDbContext _db;

    public TicketRepository(AppDbContext db)
    {
        _db = db;
    }

    // =====================================================
    // GET ALL
    // =====================================================

    public async Task<IEnumerable<Ticket>> GetAllAsync()
    {
        return await _db.Tickets
            .AsNoTracking()
            .OrderByDescending(t => t.Id)
            .ToListAsync();
    }

    // =====================================================
    // GET BY PNR
    // =====================================================

    public async Task<IEnumerable<Ticket>> GetByPNRAsync(
        string pnr)
    {
        return await _db.Tickets
            .AsNoTracking()
            .Where(t => t.PNR == pnr)
            .OrderBy(t => t.Id)
            .ToListAsync();
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    public async Task<Ticket?> GetByIdAsync(int id)
    {
        return await _db.Tickets
            .AsNoTracking()
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Trip?> GetTripByPNRAsync(string pnr)
    {
        var booking = await _db.Bookings
            .AsNoTracking()
            .FirstOrDefaultAsync(
                b => b.PNR == pnr);

        if (booking == null)
        {
            return null;
        }

        return await _db.Trips
            .AsNoTracking()
            .FirstOrDefaultAsync(
                t => t.Id == booking.TripId);
    }

    // =====================================================
    // CREATE
    // =====================================================

    public async Task<Ticket> CreateAsync(
        Ticket ticket)
    {
        _db.Tickets.Add(ticket);

        await _db.SaveChangesAsync();

        return ticket;
    }

    // =====================================================
    // UPDATE
    // =====================================================

    public async Task<bool> UpdateAsync(
        Ticket ticket)
    {
        var existing =
            await _db.Tickets
                .FirstOrDefaultAsync(t => t.Id == ticket.Id);

        if (existing == null)
            return false;

        existing.SeatId =
            ticket.SeatId;

        existing.Status =
            ticket.Status;

        existing.CancelReason =
            ticket.CancelReason;

        existing.CancelledAt =
            ticket.CancelledAt;

        await _db.SaveChangesAsync();

        return true;
    }

    // =====================================================
    // DELETE
    // =====================================================

    public async Task<bool> DeleteAsync(int id)
    {
        var item =
            await _db.Tickets
                .FirstOrDefaultAsync(t => t.Id == id);

        if (item == null)
            return false;

        _db.Tickets.Remove(item);

        await _db.SaveChangesAsync();

        return true;
    }

    // =====================================================
    // CHECK BOOKING
    // =====================================================

    public async Task<bool> BookingExistsAsync(
        string pnr)
    {
        return await _db.Bookings
            .AnyAsync(b => b.PNR == pnr);
    }

    // =====================================================
    // CHECK SEAT
    // =====================================================

    public async Task<bool> SeatExistsAsync(
        int seatId)
    {
        return await _db.Seats
            .AnyAsync(s => s.Id == seatId);
    }

    // =====================================================
    // CHECK SEAT ALREADY BOOKED
    // =====================================================

    public async Task<bool> SeatIsAlreadyBookedAsync(
    int seatId,
    string pnr)
    {
        var booking =
            await _db.Bookings
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    b => b.PNR == pnr);

        if (booking == null)
            return false;

        return await (
            from ticket in _db.Tickets
            join otherBooking in _db.Bookings
                on ticket.PNR equals otherBooking.PNR
            where ticket.SeatId == seatId
                  && ticket.Status != "Cancelled"
                  && otherBooking.TripId == booking.TripId
            select ticket
        ).AnyAsync();
    }
    public async Task<int> CountActiveTicketsByPNRAsync(string pnr)
    {
        return await _db.Tickets
            .CountAsync(t =>
                t.PNR == pnr &&
                t.Status != "Cancelled");
    }

    public async Task<decimal> GetActiveTotalFareByPNRAsync(string pnr)
    {
        return await _db.Tickets
            .Where(t =>
                t.PNR == pnr &&
                t.Status != "Cancelled")
            .SumAsync(t => t.Fare);
    }
    // =====================================================
    // CANCEL ALL TICKETS BY PNR
    // =====================================================

    public async Task<bool> CancelAllByPNRAsync(
    string pnr,
    string cancelReason)
    {
        var tickets =
            await _db.Tickets
                .Where(t =>
                    t.PNR == pnr &&
                    t.Status != "Cancelled")
                .ToListAsync();

        foreach (var ticket in tickets)
        {
            ticket.Status = "Cancelled";

            ticket.CancelReason =
                cancelReason;

            ticket.CancelledAt =
                ticket.CancelledAt ?? DateTime.UtcNow;
        }

        return true;
    }

    // =====================================================
    // COUNT TICKETS
    // =====================================================

    public async Task<int> CountByPNRAsync(
        string pnr)
    {
        return await _db.Tickets
            .CountAsync(t =>
                t.PNR == pnr &&
                t.Status != "Cancelled");
    }

    // =====================================================
    // TOTAL FARE
    // =====================================================

    public async Task<decimal> GetTotalFareByPNRAsync(
        string pnr)
    {
        return await _db.Tickets
            .Where(t =>
                t.PNR == pnr &&
                t.Status != "Cancelled")
            .SumAsync(t => t.Fare);
    }
    public async Task<bool> SeatBelongsToTripAsync(
    int seatId,
    string pnr)
    {
        var booking =
            await _db.Bookings
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    b => b.PNR == pnr);

        if (booking == null)
            return false;

        var trip =
            await _db.Trips
                .AsNoTracking()
                .FirstOrDefaultAsync(
                    t => t.Id == booking.TripId);

        if (trip == null)
            return false;

        return await _db.Seats
    .AsNoTracking()
    .AnyAsync(s =>
        s.Id == seatId &&
        s.Coach != null &&
        s.Coach.TrainId == trip.TrainId);
    }
}