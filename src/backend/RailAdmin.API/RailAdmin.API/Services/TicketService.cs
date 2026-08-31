using Microsoft.EntityFrameworkCore;
using RailAdmin.API.Data;
using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;
using System.Data;

namespace RailAdmin.API.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly IRefundService _refundService;
    private readonly ICancellationRuleService _cancellationRuleService;
    private readonly AppDbContext _db;

    public TicketService(
        ITicketRepository ticketRepository,
        IBookingRepository bookingRepository,
        IRefundService refundService,
        ICancellationRuleService cancellationRuleService,
        AppDbContext db)
    {
        _ticketRepository = ticketRepository;
        _bookingRepository = bookingRepository;
        _refundService = refundService;
        _cancellationRuleService = cancellationRuleService;
        _db = db;
    }

    // =========================================================
    // GET ALL
    // =========================================================

    public async Task<IEnumerable<TicketResponse>> GetAllAsync()
    {
        var tickets =
            await _ticketRepository.GetAllAsync();

        return tickets.Select(MapToResponse);
    }

    // =========================================================
    // GET BY PNR
    // =========================================================

    public async Task<IEnumerable<TicketResponse>> GetByPNRAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(pnr));
        }

        pnr = pnr.Trim();

        var tickets =
            await _ticketRepository
                .GetByPNRAsync(pnr);

        return tickets.Select(MapToResponse);
    }

    // =========================================================
    // GET BY ID
    // =========================================================

    public async Task<TicketResponse?> GetByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Ticket ID must be greater than 0.",
                nameof(id));
        }

        var ticket =
            await _ticketRepository
                .GetByIdAsync(id);

        return ticket == null
            ? null
            : MapToResponse(ticket);
    }

    // =========================================================
    // CREATE TICKET
    // =========================================================

    public async Task<TicketResponse> CreateAsync(
        TicketCreateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        // =====================================================
        // VALIDATE PNR
        // =====================================================

        if (string.IsNullOrWhiteSpace(dto.PNR))
        {
            throw new ArgumentException(
                "PNR is required.",
                nameof(dto.PNR));
        }

        var pnr = dto.PNR.Trim();

        // =====================================================
        // GET BOOKING
        // =====================================================

        var booking =
            await _bookingRepository
                .GetByPNRAsync(pnr);

        if (booking == null)
        {
            throw new KeyNotFoundException(
                $"Booking with PNR '{pnr}' was not found.");
        }

        // =====================================================
        // VALIDATE BOOKING STATUS
        // =====================================================

        if (string.Equals(
                booking.BookingStatus,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                $"Booking '{pnr}' has been cancelled.");
        }

        // =====================================================
        // VALIDATE PASSENGER
        // =====================================================

        if (string.IsNullOrWhiteSpace(dto.PassengerName))
        {
            throw new ArgumentException(
                "Passenger name is required.",
                nameof(dto.PassengerName));
        }

        if (dto.Age < 0 || dto.Age > 120)
        {
            throw new ArgumentException(
                "Passenger age must be between 0 and 120.",
                nameof(dto.Age));
        }

        if (string.IsNullOrWhiteSpace(dto.Gender))
        {
            throw new ArgumentException(
                "Gender is required.",
                nameof(dto.Gender));
        }

        // =====================================================
        // VALIDATE FARE
        // =====================================================

        if (dto.Fare < 0)
        {
            throw new ArgumentException(
                "Fare cannot be negative.",
                nameof(dto.Fare));
        }

        // =====================================================
        // GET TRIP
        // =====================================================

        var trip =
            await _db.Trips
                .FirstOrDefaultAsync(
                    t => t.Id == booking.TripId);

        if (trip == null)
        {
            throw new KeyNotFoundException(
                $"Trip {booking.TripId} for booking '{pnr}' was not found.");
        }

        // =====================================================
        // VALIDATE TRIP STATUS
        // =====================================================

        if (string.Equals(
                trip.Status,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                $"Trip {trip.Id} has been cancelled.");
        }

        // =====================================================
        // BEGIN TRANSACTION
        // =====================================================

        await using var transaction =
            await _db.Database.BeginTransactionAsync(
                IsolationLevel.Serializable);

        try
        {
            // =================================================
            // RELOAD BOOKING INSIDE TRANSACTION
            // =================================================

            booking =
                await _bookingRepository
                    .GetByPNRAsync(pnr);

            if (booking == null)
            {
                throw new KeyNotFoundException(
                    $"Booking with PNR '{pnr}' was not found.");
            }

            if (string.Equals(
                    booking.BookingStatus,
                    "Cancelled",
                    StringComparison.OrdinalIgnoreCase))
            {
                throw new InvalidOperationException(
                    $"Booking '{pnr}' has been cancelled.");
            }

            // =================================================
            // RELOAD TRIP INSIDE TRANSACTION
            // =================================================

            trip =
                await _db.Trips
                    .FirstOrDefaultAsync(
                        t => t.Id == booking.TripId);

            if (trip == null)
            {
                throw new KeyNotFoundException(
                    $"Trip {booking.TripId} was not found.");
            }

            // =================================================
            // CHECK PASSENGER LIMIT
            // =================================================

            var currentTickets =
                await _ticketRepository
                    .CountByPNRAsync(pnr);

            if (currentTickets >= booking.TotalPassengers)
            {
                throw new InvalidOperationException(
                    $"Booking '{pnr}' already has the maximum number of passengers.");
            }

            // =================================================
            // CHECK AVAILABLE CAPACITY
            // =================================================

            if (dto.SeatId.HasValue &&
                trip.AvailableSeats <= 0)
            {
                throw new InvalidOperationException(
                    "No available seats remain for this trip.");
            }

            // =================================================
            // SEAT VALIDATION
            // =================================================

            if (dto.SeatId.HasValue)
            {
                var seatId = dto.SeatId.Value;

                // ---------------------------------------------
                // Seat exists
                // ---------------------------------------------

                var seatExists =
                    await _ticketRepository
                        .SeatExistsAsync(seatId);

                if (!seatExists)
                {
                    throw new KeyNotFoundException(
                        $"Seat with ID {seatId} was not found.");
                }

                // ---------------------------------------------
                // Seat belongs to trip
                // ---------------------------------------------

                var seatBelongsToTrip =
                    await _ticketRepository
                        .SeatBelongsToTripAsync(
                            seatId,
                            pnr);

                if (!seatBelongsToTrip)
                {
                    throw new InvalidOperationException(
                        $"Seat {seatId} does not belong to the train of booking '{pnr}'.");
                }

                // ---------------------------------------------
                // Seat already booked
                // ---------------------------------------------

                var alreadyBooked =
                    await _ticketRepository
                        .SeatIsAlreadyBookedAsync(
                            seatId,
                            pnr);

                if (alreadyBooked)
                {
                    throw new InvalidOperationException(
                        $"Seat {seatId} is already booked for this trip.");
                }
            }

            // =================================================
            // CREATE TICKET
            // =================================================

            var ticket = new Ticket
            {
                PNR = pnr,

                SeatId = dto.SeatId,

                PassengerName =
                    dto.PassengerName.Trim(),

                Age = dto.Age,

                Gender =
                    dto.Gender.Trim(),

                Fare = dto.Fare,

                Status =
                    dto.SeatId.HasValue
                        ? "Confirmed"
                        : "Waiting",

                CancelReason = null,

                CancelledAt = null
            };

            _db.Tickets.Add(ticket);

            // =================================================
            // RESERVE SEAT
            // =================================================

            if (dto.SeatId.HasValue)
            {
                trip.AvailableSeats--;

                if (trip.AvailableSeats < 0)
                {
                    throw new InvalidOperationException(
                        "Available seats cannot be negative.");
                }
            }

            // =================================================
            // UPDATE BOOKING TOTAL
            // =================================================

            await _db.SaveChangesAsync();

            var total =
                await _ticketRepository
                    .GetTotalFareByPNRAsync(pnr);

            await _bookingRepository
                .UpdateTotalAmountAsync(
                    pnr,
                    total);

            // =================================================
            // COMMIT
            // =================================================

            await transaction.CommitAsync();

            return MapToResponse(ticket);
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // =========================================================
    // UPDATE TICKET
    // =========================================================

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

        // =====================================================
        // GET EXISTING TICKET
        // =====================================================

        var existingTicket =
            await _ticketRepository
                .GetByIdAsync(id);

        if (existingTicket == null)
        {
            return false;
        }

        // =====================================================
        // VALIDATE STATUS
        // =====================================================

        var status =
            dto.Status?.Trim();

        if (string.IsNullOrWhiteSpace(status))
        {
            throw new ArgumentException(
                "Ticket status is required.",
                nameof(dto.Status));
        }

        var allowedStatuses =
            new[]
            {
                "Confirmed",
                "Waiting",
                "Cancelled"
            };

        if (!allowedStatuses.Contains(
                status,
                StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "Ticket status must be Confirmed, Waiting, or Cancelled.",
                nameof(dto.Status));
        }

        status =
            allowedStatuses.First(
                x => x.Equals(
                    status,
                    StringComparison.OrdinalIgnoreCase));

        // =====================================================
        // PREVENT INVALID TRANSITION
        // =====================================================

        if (string.Equals(
                existingTicket.Status,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase) &&
            !string.Equals(
                status,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "A cancelled ticket cannot be changed to another status.");
        }

        // =====================================================
        // CONFIRMED MUST HAVE SEAT
        // =====================================================

        if (status == "Confirmed" &&
            !dto.SeatId.HasValue)
        {
            throw new InvalidOperationException(
                "A confirmed ticket must have a seat.");
        }

        // =====================================================
        // BEGIN TRANSACTION
        // =====================================================

        await using var transaction =
            await _db.Database.BeginTransactionAsync(
                IsolationLevel.Serializable);

        try
        {
            // =================================================
            // LOAD TRACKED TICKET
            // =================================================

            var ticket =
                await _db.Tickets
                    .FirstOrDefaultAsync(
                        t => t.Id == id);

            if (ticket == null)
            {
                return false;
            }

            // =================================================
            // GET BOOKING
            // =================================================

            var booking =
                await _db.Bookings
                    .FirstOrDefaultAsync(
                        b => b.PNR == ticket.PNR);

            if (booking == null)
            {
                throw new KeyNotFoundException(
                    $"Booking with PNR '{ticket.PNR}' was not found.");
            }

            // =================================================
            // GET TRIP
            // =================================================

            var trip =
                await _db.Trips
                    .FirstOrDefaultAsync(
                        t => t.Id == booking.TripId);

            if (trip == null)
            {
                throw new KeyNotFoundException(
                    $"Trip {booking.TripId} was not found.");
            }

            // =================================================
            // CANCEL TICKET
            // =================================================

            if (status == "Cancelled" &&
                !string.Equals(
                    ticket.Status,
                    "Cancelled",
                    StringComparison.OrdinalIgnoreCase))
            {
                await CancelTicketInternalAsync(
                    ticket,
                    booking,
                    trip,
                    dto.CancelReason);
            }
            else
            {
                // =============================================
                // CONFIRMED / WAITING
                // =============================================

                if (status == "Confirmed" &&
                    dto.SeatId.HasValue)
                {
                    var seatId =
                        dto.SeatId.Value;

                    var seatExists =
                        await _ticketRepository
                            .SeatExistsAsync(seatId);

                    if (!seatExists)
                    {
                        throw new KeyNotFoundException(
                            $"Seat with ID {seatId} was not found.");
                    }

                    var seatBelongsToTrip =
                        await _ticketRepository
                            .SeatBelongsToTripAsync(
                                seatId,
                                ticket.PNR);

                    if (!seatBelongsToTrip)
                    {
                        throw new InvalidOperationException(
                            $"Seat {seatId} does not belong to the booking trip.");
                    }

                    var alreadyBooked =
                        await _ticketRepository
                            .SeatIsAlreadyBookedAsync(
                                seatId,
                                ticket.PNR);

                    // Cho phép giữ nguyên ghế hiện tại
                    if (alreadyBooked &&
                        seatId != ticket.SeatId)
                    {
                        throw new InvalidOperationException(
                            $"Seat {seatId} is already booked.");
                    }
                }

                // =============================================
                // WAITING → CONFIRMED
                // =============================================

                if (!string.Equals(
                        ticket.Status,
                        "Confirmed",
                        StringComparison.OrdinalIgnoreCase) &&
                    status == "Confirmed")
                {
                    if (trip.AvailableSeats <= 0)
                    {
                        throw new InvalidOperationException(
                            "No available seats remain for this trip.");
                    }

                    trip.AvailableSeats--;
                }

                // =============================================
                // CONFIRMED → WAITING
                // =============================================

                if (string.Equals(
                        ticket.Status,
                        "Confirmed",
                        StringComparison.OrdinalIgnoreCase) &&
                    status == "Waiting")
                {
                    trip.AvailableSeats++;

                    if (trip.AvailableSeats >
                        trip.TotalCapacity)
                    {
                        trip.AvailableSeats =
                            trip.TotalCapacity;
                    }
                }

                ticket.SeatId =
                    dto.SeatId;

                ticket.Status =
                    status;

                ticket.CancelReason = null;

                ticket.CancelledAt = null;
            }

            // =================================================
            // UPDATE BOOKING TOTAL
            // =================================================

            await _db.SaveChangesAsync();

            var total =
                await _ticketRepository
                    .GetTotalFareByPNRAsync(
                        ticket.PNR);

            booking.TotalAmount = total;

            await _db.SaveChangesAsync();

            // =================================================
            // COMMIT
            // =================================================

            await transaction.CommitAsync();

            return true;
        }
        catch
        {
            await transaction.RollbackAsync();
            throw;
        }
    }

    // =========================================================
    // CANCEL TICKET INTERNAL
    // =========================================================

    private async Task CancelTicketInternalAsync(
        Ticket ticket,
        Booking booking,
        Trip trip,
        string? reason)
    {
        // =====================================================
        // CANCEL REASON
        // =====================================================

        var cancelReason =
            string.IsNullOrWhiteSpace(reason)
                ? "Ticket cancelled by administrator."
                : reason.Trim();

        // =====================================================
        // CALCULATE CANCELLATION FEE
        // =====================================================

        var departureDateTime =
            trip.JourneyDate.Date
                .Add(trip.DepartureTime);

        var hoursBeforeDeparture =
            (departureDateTime - DateTime.UtcNow)
            .TotalHours;

        // =====================================================
        // GET CANCELLATION RULE
        // =====================================================

        var rules =
            await _cancellationRuleService
                .GetAllAsync();

        var selectedRule =
            rules
                .Where(r =>
                    hoursBeforeDeparture >=
                    r.HoursBeforeDeparture)
                .OrderByDescending(
                    r => r.HoursBeforeDeparture)
                .FirstOrDefault();

        // =====================================================
        // CALCULATE FEE
        // =====================================================

        decimal cancellationFee = 0;

        int? cancellationRuleId = null;

        if (selectedRule != null)
        {
            cancellationRuleId =
                selectedRule.Id;

            if (string.Equals(
                    selectedRule.FeeType,
                    "PERCENTAGE",
                    StringComparison.OrdinalIgnoreCase))
            {
                cancellationFee =
                    ticket.Fare *
                    selectedRule.FeeValue /
                    100m;
            }
            else if (string.Equals(
                    selectedRule.FeeType,
                    "FLAT",
                    StringComparison.OrdinalIgnoreCase))
            {
                cancellationFee =
                    selectedRule.FeeValue;
            }

            // =================================================
            // APPLY MIN FEE
            // =================================================

            if (cancellationFee <
                selectedRule.MinFee)
            {
                cancellationFee =
                    selectedRule.MinFee;
            }
        }

        // =====================================================
        // DO NOT EXCEED TICKET FARE
        // =====================================================

        if (cancellationFee >
            ticket.Fare)
        {
            cancellationFee =
                ticket.Fare;
        }

        var refundAmount =
            ticket.Fare -
            cancellationFee;

        if (refundAmount < 0)
        {
            refundAmount = 0;
        }

        // =====================================================
        // CREATE REFUND ONLY ONCE
        // =====================================================

        var existingRefund =
            await _refundService
                .GetByTicketIdAsync(
                    ticket.Id);

        if (existingRefund == null)
        {
            var refundRequest =
                new RefundCreateRequest
                {
                    TicketId =
                        ticket.Id,

                    CancellationRuleId =
                        cancellationRuleId,

                    AmountPaid =
                        ticket.Fare,

                    CancellationFee =
                        cancellationFee
                };

            await _refundService
                .CreateAsync(
                    refundRequest);
        }

        // =====================================================
        // RELEASE SEAT
        // =====================================================

        if (ticket.SeatId.HasValue)
        {
            trip.AvailableSeats++;

            if (trip.AvailableSeats >
                trip.TotalCapacity)
            {
                trip.AvailableSeats =
                    trip.TotalCapacity;
            }
        }

        // =====================================================
        // UPDATE TICKET
        // =====================================================

        ticket.SeatId = null;

        ticket.Status =
            "Cancelled";

        ticket.CancelReason =
            cancelReason;

        ticket.CancelledAt =
            DateTime.UtcNow;
    }

    // =========================================================
    // DELETE
    // =========================================================

    public async Task<bool> DeleteAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Ticket ID must be greater than 0.",
                nameof(id));
        }

        var existingTicket =
            await _ticketRepository
                .GetByIdAsync(id);

        if (existingTicket == null)
        {
            return false;
        }

        // =====================================================
        // DO NOT DELETE CANCELLED TICKET
        // =====================================================

        if (string.Equals(
                existingTicket.Status,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "A cancelled ticket should not be deleted.");
        }

        return await _ticketRepository
            .DeleteAsync(id);
    }

    // =========================================================
    // UPDATE BOOKING TOTAL
    // =========================================================

    private async Task UpdateBookingTotalAsync(
        string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            return;
        }

        pnr = pnr.Trim();

        var booking =
            await _bookingRepository
                .GetByPNRAsync(pnr);

        if (booking == null)
        {
            return;
        }

        var total =
            await _ticketRepository
                .GetTotalFareByPNRAsync(pnr);

        booking.TotalAmount =
            total;

        await _bookingRepository
            .UpdateTotalAmountAsync(
                pnr,
                total);
    }

    // =========================================================
    // MAP RESPONSE
    // =========================================================

    private static TicketResponse MapToResponse(
        Ticket ticket)
    {
        return new TicketResponse
        {
            Id =
                ticket.Id,

            PNR =
                ticket.PNR,

            SeatId =
                ticket.SeatId,

            PassengerName =
                ticket.PassengerName,

            Age =
                ticket.Age,

            Gender =
                ticket.Gender,

            Fare =
                ticket.Fare,

            Status =
                ticket.Status,

            CancelReason =
                ticket.CancelReason,

            CancelledAt =
                ticket.CancelledAt
        };
    }

    public async Task<bool> CancelAsync(
        int ticketId,
        string reason)
    {
        var ticket =
            await _ticketRepository.GetByIdAsync(ticketId);

        if (ticket == null)
            return false;

        // Không cho cancel lần 2
        if (ticket.Status == "Cancelled")
            return false;

        // Chỉ Confirmed mới được cancel
        if (ticket.Status != "Confirmed")
            return false;

        ticket.Status = "Cancelled";
        ticket.CancelReason = reason;
        ticket.CancelledAt = DateTime.UtcNow;

        return await _ticketRepository.UpdateAsync(ticket);
    }

    public async Task<bool> IsCancellableAsync(
        int ticketId)
    {
        var ticket =
            await _ticketRepository.GetByIdAsync(ticketId);

        if (ticket == null)
            return false;

        return ticket.Status == "Confirmed";
    }

    public async Task<TicketResponse?> GetCancellationContextAsync(int ticketId)
    {
        var ticket = await _ticketRepository
            .GetByIdWithBookingAndTripAsync(ticketId);

        if (ticket == null)
            return null;

        var booking = ticket.Booking;

        if (booking == null)
            throw new Exception("Booking not found.");

        var trip = booking.Trip;

        if (trip == null)
            throw new Exception("Trip not found.");

        Console.WriteLine($"Ticket: {ticket.Id}");
        Console.WriteLine($"PNR: {ticket.PNR}");
        Console.WriteLine($"Trip: {trip.Id}");
        Console.WriteLine($"Departure: {trip.DepartureTime}");

        return MapToResponse(ticket);
    }
}