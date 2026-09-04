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
    // BASE QUERY
    // Ticket
    //  └── Booking
    //       ├── User
    //       └── Trip
    //            ├── Train
    //            ├── FromStation
    //            └── ToStation
    //  └── Seat
    //       └── Coach
    //            └── Train
    // =====================================================

    private IQueryable<Ticket> TicketQuery()
    {
        return _db.Tickets
            .AsNoTracking()

            // BOOKING
            .Include(t => t.Booking)
                .ThenInclude(b => b!.User)

            // TRIP → TRAIN
            .Include(t => t.Booking)
                .ThenInclude(b => b!.Trip)
                    .ThenInclude(tr => tr!.Train)

            // TRIP → FROM
            .Include(t => t.Booking)
                .ThenInclude(b => b!.Trip)
                    .ThenInclude(tr => tr!.FromStation)

            // TRIP → TO
            .Include(t => t.Booking)
                .ThenInclude(b => b!.Trip)
                    .ThenInclude(tr => tr!.ToStation)

            // SEAT → COACH → TRAIN
            .Include(t => t.Seat)
                .ThenInclude(s => s!.Coach)
                    .ThenInclude(c => c!.Train);
    }

    // =====================================================
    // GET ALL
    // =====================================================

    public async Task<IEnumerable<Ticket>> GetAllAsync()
    {
        return await TicketQuery()
            .OrderByDescending(t => t.Id)
            .ToListAsync();
    }

    // =====================================================
    // GET BY ID
    // =====================================================

    public async Task<Ticket?> GetByIdAsync(int id)
    {
        return await TicketQuery()
            .FirstOrDefaultAsync(t => t.Id == id);
    }

    // =====================================================
    // GET BY ID WITH BOOKING
    // =====================================================

    public async Task<Ticket?> GetByIdWithBookingAsync(
        int ticketId)
    {
        return await TicketQuery()
            .FirstOrDefaultAsync(
                t => t.Id == ticketId);
    }

    // =====================================================
    // GET BY ID WITH BOOKING + TRIP
    // =====================================================

    public async Task<Ticket?> GetByIdWithBookingAndTripAsync(
        int id)
    {
        return await TicketQuery()
            .FirstOrDefaultAsync(
                t => t.Id == id);
    }

    // =====================================================
    // GET BY PNR
    // =====================================================

    public async Task<IEnumerable<Ticket>> GetByPNRAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return Enumerable.Empty<Ticket>();

        pnr = pnr.Trim();

        return await TicketQuery()
            .Where(t => t.PNR == pnr)
            .OrderBy(t => t.Id)
            .ToListAsync();
    }

    // =====================================================
    // GET MY TICKETS
    // =====================================================

    public async Task<IEnumerable<Ticket>> GetByUserIdAsync(
        int userId)
    {
        if (userId <= 0)
            return Enumerable.Empty<Ticket>();

        return await TicketQuery()
            .Where(t =>
                t.Booking != null &&
                t.Booking.UserId == userId)
            .OrderByDescending(
                t => t.Booking!.BookingDate)
            .ThenByDescending(
                t => t.Id)
            .ToListAsync();
    }

    // =====================================================
    // GET TRIP BY PNR
    // =====================================================

    public async Task<Trip?> GetTripByPNRAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return null;

        pnr = pnr.Trim();

        return await _db.Bookings
            .AsNoTracking()
            .Where(b => b.PNR == pnr)
            .Include(b => b.Trip)
                .ThenInclude(t => t!.Train)
            .Include(b => b.Trip)
                .ThenInclude(t => t!.FromStation)
            .Include(b => b.Trip)
                .ThenInclude(t => t!.ToStation)
            .Select(b => b.Trip)
            .FirstOrDefaultAsync();
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
                .FirstOrDefaultAsync(
                    t => t.Id == ticket.Id);

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
        var ticket =
            await _db.Tickets
                .FirstOrDefaultAsync(
                    t => t.Id == id);

        if (ticket == null)
            return false;

        _db.Tickets.Remove(ticket);

        await _db.SaveChangesAsync();

        return true;
    }

    // =====================================================
    // BOOKING EXISTS
    // =====================================================

    public async Task<bool> BookingExistsAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return false;

        pnr = pnr.Trim();

        return await _db.Bookings
            .AnyAsync(b => b.PNR == pnr);
    }

    // =====================================================
    // SEAT EXISTS
    // =====================================================

    public async Task<bool> SeatExistsAsync(
        int seatId)
    {
        return await _db.Seats
            .AnyAsync(s => s.Id == seatId);
    }

    // =====================================================
    // SEAT ALREADY BOOKED
    // =====================================================

    public async Task<bool> SeatIsAlreadyBookedAsync(
        int seatId,
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return false;

        pnr = pnr.Trim();

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
            where
                ticket.SeatId == seatId &&
                ticket.Status != "Cancelled" &&
                otherBooking.TripId == booking.TripId
            select ticket
        ).AnyAsync();
    }

    // =====================================================
    // SEAT BELONGS TO TRIP
    // =====================================================

    public async Task<bool> SeatBelongsToTripAsync(
        int seatId,
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return false;

        pnr = pnr.Trim();

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
            .Include(s => s.Coach)
            .AnyAsync(s =>
                s.Id == seatId &&
                s.Coach != null &&
                s.Coach.TrainId == trip.TrainId);
    }

    // =====================================================
    // COUNT ACTIVE TICKETS
    // =====================================================

    public async Task<int> CountByPNRAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return 0;

        return await _db.Tickets
            .CountAsync(t =>
                t.PNR == pnr &&
                t.Status != "Cancelled");
    }

    public async Task<int> CountActiveTicketsByPNRAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return 0;

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
        if (string.IsNullOrWhiteSpace(pnr))
            return 0;

        return await _db.Tickets
            .Where(t =>
                t.PNR == pnr &&
                t.Status != "Cancelled")
            .SumAsync(t => t.Fare);
    }

    public async Task<decimal> GetActiveTotalFareByPNRAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return 0;

        return await _db.Tickets
            .Where(t =>
                t.PNR == pnr &&
                t.Status != "Cancelled")
            .SumAsync(t => t.Fare);
    }

    // =====================================================
    // CANCEL ALL BY PNR
    // =====================================================

    public async Task<bool> CancelAllByPNRAsync(
    string pnr,
    string cancelReason)
    {
        if (string.IsNullOrWhiteSpace(pnr))
            return false;

        pnr = pnr.Trim();

        var tickets = await _db.Tickets
            .Where(t =>
                t.PNR == pnr &&
                t.Status != "Cancelled")
            .ToListAsync();

        if (!tickets.Any())
            return false;

        var cancelledAt = DateTime.UtcNow;

        foreach (var ticket in tickets)
        {
            ticket.Status = "Cancelled";

            ticket.CancelReason =
                string.IsNullOrWhiteSpace(cancelReason)
                    ? "Ticket cancelled."
                    : cancelReason.Trim();

            ticket.CancelledAt =
                cancelledAt;

            // Không cần set SeatId = null ở đây
            // nếu TicketService cần SeatId để release seat.
        }

        await _db.SaveChangesAsync();

        return true;
    }

    // =====================================================
    // CANCEL ONE
    // =====================================================

    public async Task<bool> CancelAsync(
        int ticketId,
        string? cancelReason,
        DateTime cancelledAt)
    {
        var ticket =
            await _db.Tickets
                .FirstOrDefaultAsync(
                    t => t.Id == ticketId);

        if (ticket == null)
            return false;

        if (ticket.Status == "Cancelled")
            return false;

        ticket.Status =
            "Cancelled";

        ticket.CancelReason =
            cancelReason;

        ticket.CancelledAt =
            cancelledAt;

        await _db.SaveChangesAsync();

        return true;
    }

    // =====================================================
    // RELEASE SEAT
    // =====================================================

    public async Task<bool> ReleaseSeatAsync(
        int seatId)
    {
        var seat =
            await _db.Seats
                .FirstOrDefaultAsync(
                    s => s.Id == seatId);

        if (seat == null)
            return false;

        // Seat không có IsAvailable
        // nên không cần thay đổi Seat.

        return true;
    }
}