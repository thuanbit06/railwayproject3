using RailAdmin.API.DTOs.Request.Refund;
using RailAdmin.API.DTOs.Request.Ticket;
using RailAdmin.API.DTOs.Response;
using RailAdmin.API.Models;
using RailAdmin.API.Repository.IRepository;
using RailAdmin.API.Services.IService;

namespace RailAdmin.API.Services;

public class TicketService : ITicketService
{
    private readonly ITicketRepository _ticketRepository;
    private readonly IBookingRepository _bookingRepository;
    private readonly ISeatService _seatService;
    private readonly IRefundService _refundService;
    private readonly ICancellationRuleService _cancellationRuleService;

    public TicketService(
        ITicketRepository ticketRepository,
        IBookingRepository bookingRepository,
        ISeatService seatService,
        IRefundService refundService,
        ICancellationRuleService cancellationRuleService)
    {
        _ticketRepository = ticketRepository;
        _bookingRepository = bookingRepository;
        _seatService = seatService;
        _refundService = refundService;
        _cancellationRuleService = cancellationRuleService;
    }

    // =========================================================
    // GET ALL TICKETS
    // =========================================================

    public async Task<IEnumerable<TicketResponse>> GetAllAsync()
    {
        var tickets = await _ticketRepository.GetAllAsync();
        return tickets.Select(MapToResponse);
    }

    // =========================================================
    // GET TICKETS BY PNR
    // =========================================================

    public async Task<IEnumerable<TicketResponse>> GetByPNRAsync(string pnr)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException("PNR is required.", nameof(pnr));
        }

        pnr = pnr.Trim();

        var tickets = await _ticketRepository.GetByPNRAsync(pnr);
        return tickets.Select(MapToResponse);
    }

    // =========================================================
    // GET TICKET BY ID
    // =========================================================

    public async Task<TicketResponse?> GetByIdAsync(int id)
    {
        if (id <= 0)
        {
            throw new ArgumentException(
                "Ticket ID must be greater than 0.",
                nameof(id));
        }

        var ticket = await _ticketRepository.GetByIdAsync(id);

        if (ticket == null)
            return null;

        return MapToResponse(ticket);
    }

    // =========================================================
    // GET MY TICKETS
    // =========================================================

    public async Task<IEnumerable<TicketResponse>> GetByUserIdAsync(int userId)
    {
        if (userId <= 0)
            return Enumerable.Empty<TicketResponse>();

        var tickets = await _ticketRepository.GetByUserIdAsync(userId);
        return tickets.Select(MapToResponse);
    }

    // =========================================================
    // CREATE TICKET
    // =========================================================
    // Dùng trong quá trình booking.
    // MyTickets không cần gọi trực tiếp endpoint này.

    public async Task<TicketResponse> CreateAsync(TicketCreateRequest dto)
    {
        ArgumentNullException.ThrowIfNull(dto);

        if (string.IsNullOrWhiteSpace(dto.PNR))
        {
            throw new ArgumentException("PNR is required.", nameof(dto.PNR));
        }

        var pnr = dto.PNR.Trim();

        // -----------------------------------------------------
        // BOOKING
        // -----------------------------------------------------

        var booking = await _bookingRepository.GetByPNRAsync(pnr);

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

        // -----------------------------------------------------
        // PASSENGER
        // -----------------------------------------------------

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

        // -----------------------------------------------------
        // FARE
        // -----------------------------------------------------

        if (dto.Fare < 0)
        {
            throw new ArgumentException(
                "Fare cannot be negative.",
                nameof(dto.Fare));
        }

        // -----------------------------------------------------
        // PASSENGER LIMIT
        // -----------------------------------------------------

        var currentTickets = await _ticketRepository.CountByPNRAsync(pnr);

        if (currentTickets >= booking.TotalPassengers)
        {
            throw new InvalidOperationException(
                $"Booking '{pnr}' already has the maximum number of passengers.");
        }

        // -----------------------------------------------------
        // SEAT VALIDATION
        // -----------------------------------------------------

        if (dto.SeatId.HasValue)
        {
            var seatId = dto.SeatId.Value;

            if (!await _seatService.SeatExistsAsync(seatId))
            {
                throw new KeyNotFoundException(
                    $"Seat with ID {seatId} was not found.");
            }

            if (!await _seatService.SeatBelongsToTripAsync(seatId, pnr))
            {
                throw new InvalidOperationException(
                    $"Seat {seatId} does not belong to the booking trip.");
            }

            if (await _seatService.SeatIsAlreadyBookedAsync(seatId, pnr))
            {
                throw new InvalidOperationException(
                    $"Seat {seatId} is already booked.");
            }
        }

        // -----------------------------------------------------
        // CREATE
        // -----------------------------------------------------

        var ticket = new Ticket
        {
            PNR = pnr,
            SeatId = dto.SeatId,
            PassengerName = dto.PassengerName.Trim(),
            Age = dto.Age,
            Gender = dto.Gender.Trim(),
            Fare = dto.Fare,
            Status = dto.SeatId.HasValue ? "Confirmed" : "Waiting",
            CancelReason = null,
            CancelledAt = null
        };

        await _ticketRepository.CreateAsync(ticket);

        // -----------------------------------------------------
        // UPDATE BOOKING TOTAL
        // -----------------------------------------------------

        var total = await _ticketRepository.GetTotalFareByPNRAsync(pnr);
        await _bookingRepository.UpdateTotalAmountAsync(pnr, total);

        var createdTicket = await _ticketRepository.GetByIdAsync(ticket.Id);

        return MapToResponse(createdTicket ?? ticket);
    }

    // =========================================================
    // UPDATE TICKET
    // =========================================================

    public async Task<bool> UpdateAsync(int id, TicketUpdateRequest dto)
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
            return false;

        var status = dto.Status?.Trim();

        if (string.IsNullOrWhiteSpace(status))
        {
            throw new ArgumentException(
                "Ticket status is required.",
                nameof(dto.Status));
        }

        var allowedStatuses = new[] { "Confirmed", "Waiting", "Cancelled" };

        if (!allowedStatuses.Contains(status, StringComparer.OrdinalIgnoreCase))
        {
            throw new ArgumentException(
                "Ticket status must be Confirmed, Waiting, or Cancelled.",
                nameof(dto.Status));
        }

        status = allowedStatuses.First(x =>
            x.Equals(status, StringComparison.OrdinalIgnoreCase));

        if (string.Equals(
                existingTicket.Status,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase) &&
            status != "Cancelled")
        {
            throw new InvalidOperationException(
                "A cancelled ticket cannot be changed to another status.");
        }

        if (status == "Confirmed" && !dto.SeatId.HasValue)
        {
            throw new InvalidOperationException(
                "A confirmed ticket must have a seat.");
        }

        var ticket = await _ticketRepository.GetByIdAsync(id);

        if (ticket == null)
            return false;

        var booking = await _bookingRepository.GetByPNRAsync(ticket.PNR);

        if (booking == null)
        {
            throw new KeyNotFoundException(
                $"Booking with PNR '{ticket.PNR}' was not found.");
        }

        // -------------------------------------------------
        // CANCEL
        // -------------------------------------------------

        if (status == "Cancelled" &&
            !string.Equals(
                ticket.Status,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            // Load Trip để tính phí hủy chính xác
            var ticketWithNav = await _ticketRepository
                .GetByIdWithBookingAndTripAsync(ticket.Id);

            var trip = ticketWithNav?.Booking?.Trip;

            if (trip == null)
            {
                throw new KeyNotFoundException(
                    $"Trip for booking '{ticket.PNR}' was not found.");
            }

            await CancelTicketInternalAsync(
                ticket,
                booking,
                trip,
                dto.CancelReason);
        }
        else
        {
            // -------------------------------------------------
            // CONFIRMED + SEAT
            // -------------------------------------------------

            if (status == "Confirmed" && dto.SeatId.HasValue)
            {
                var seatId = dto.SeatId.Value;

                if (!await _seatService.SeatExistsAsync(seatId))
                {
                    throw new KeyNotFoundException(
                        $"Seat {seatId} was not found.");
                }

                if (!await _seatService.SeatBelongsToTripAsync(seatId, ticket.PNR))
                {
                    throw new InvalidOperationException(
                        $"Seat {seatId} does not belong to the booking trip.");
                }

                var alreadyBooked = await _seatService
                    .SeatIsAlreadyBookedAsync(seatId, ticket.PNR);

                if (alreadyBooked && seatId != ticket.SeatId)
                {
                    throw new InvalidOperationException(
                        $"Seat {seatId} is already booked.");
                }
            }

            ticket.SeatId = dto.SeatId;
            ticket.Status = status;
            ticket.CancelReason = null;
            ticket.CancelledAt = null;
        }

        await _ticketRepository.UpdateAsync(ticket);

        var total = await _ticketRepository.GetTotalFareByPNRAsync(ticket.PNR);
        await _bookingRepository.UpdateTotalAmountAsync(ticket.PNR, total);

        return true;
    }

    // =========================================================
    // CANCEL BY PNR
    // PUT /api/tickets/{pnr}/cancel
    // =========================================================

    public async Task<bool> CancelAsync(string pnr, string reason)
    {
        if (string.IsNullOrWhiteSpace(pnr))
        {
            throw new ArgumentException("PNR is required.", nameof(pnr));
        }

        pnr = pnr.Trim();

        var booking = await _bookingRepository.GetByPNRAsync(pnr);

        if (booking == null)
            return false;

        if (string.Equals(
                booking.BookingStatus,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        var tickets = (await _ticketRepository.GetByPNRAsync(pnr)).ToList();

        if (!tickets.Any())
            return false;

        var activeTickets = tickets
            .Where(t => !string.Equals(
                t.Status,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
            .ToList();

        if (!activeTickets.Any())
            return false;

        // -------------------------------------------------
        // Load Trip 1 lần (dùng chung cho mọi ticket)
        // -------------------------------------------------

        var firstTicketWithNav = await _ticketRepository
            .GetByIdWithBookingAndTripAsync(activeTickets[0].Id);

        var trip = firstTicketWithNav?.Booking?.Trip;

        if (trip == null)
        {
            throw new KeyNotFoundException(
                $"Trip for booking '{pnr}' was not found.");
        }

        // -------------------------------------------------
        // Hủy từng ticket
        // -------------------------------------------------

        foreach (var ticket in activeTickets)
        {
            await CancelTicketInternalAsync(ticket, booking, trip, reason);
            await _ticketRepository.UpdateAsync(ticket);
        }

        // -------------------------------------------------
        // Booking -> Cancelled
        // -------------------------------------------------

        booking.BookingStatus = "Cancelled";

        // -------------------------------------------------
        // Tổng tiền active = 0
        // -------------------------------------------------

        await _bookingRepository.UpdateTotalAmountAsync(pnr, 0);

        return true;
    }

    // =========================================================
    // CANCEL SINGLE TICKET INTERNAL
    // =========================================================

    private async Task CancelTicketInternalAsync(
        Ticket ticket,
        Booking booking,
        Trip trip,
        string? reason)
    {
        var cancelReason = string.IsNullOrWhiteSpace(reason)
            ? "Ticket cancelled by user."
            : reason.Trim();

        // -----------------------------------------------------
        // DEPARTURE DATETIME
        // -----------------------------------------------------

        var departureDateTime = trip.JourneyDate.Date.Add(trip.DepartureTime);
        var hoursBeforeDeparture = (departureDateTime - DateTime.UtcNow).TotalHours;

        // -----------------------------------------------------
        // CANCELLATION RULE
        // -----------------------------------------------------

        decimal cancellationFee = 0;
        int? cancellationRuleId = null;

        var rules = await _cancellationRuleService.GetAllAsync();

        var selectedRule = rules
            .Where(r => hoursBeforeDeparture >= r.HoursBeforeDeparture)
            .OrderByDescending(r => r.HoursBeforeDeparture)
            .FirstOrDefault();

        if (selectedRule != null)
        {
            cancellationRuleId = selectedRule.Id;

            if (string.Equals(
                    selectedRule.FeeType,
                    "PERCENTAGE",
                    StringComparison.OrdinalIgnoreCase))
            {
                cancellationFee = ticket.Fare * selectedRule.FeeValue / 100m;
            }
            else if (string.Equals(
                    selectedRule.FeeType,
                    "FLAT",
                    StringComparison.OrdinalIgnoreCase))
            {
                cancellationFee = selectedRule.FeeValue;
            }

            if (cancellationFee < selectedRule.MinFee)
            {
                cancellationFee = selectedRule.MinFee;
            }
        }

        if (cancellationFee > ticket.Fare)
        {
            cancellationFee = ticket.Fare;
        }

        // -----------------------------------------------------
        // REFUND
        // -----------------------------------------------------

        var existingRefund = await _refundService.GetByTicketIdAsync(ticket.Id);

        if (existingRefund == null)
        {
            var refundRequest = new RefundCreateRequest
            {
                TicketId = ticket.Id,
                CancellationRuleId = cancellationRuleId,
                AmountPaid = ticket.Fare,
                CancellationFee = cancellationFee
            };

            await _refundService.CreateAsync(refundRequest);
        }

        // -----------------------------------------------------
        // UPDATE TICKET (giải phóng ghế + đánh dấu cancelled)
        // -----------------------------------------------------

        ticket.SeatId = null;
        ticket.Status = "Cancelled";
        ticket.CancelReason = cancelReason;
        ticket.CancelledAt = DateTime.UtcNow;
    }

    // =========================================================
    // CHECK CANCELLABLE
    // =========================================================

    public async Task<bool> IsCancellableAsync(int ticketId)
    {
        if (ticketId <= 0)
            return false;

        var ticket = await _ticketRepository.GetByIdAsync(ticketId);

        if (ticket == null)
            return false;

        return string.Equals(
            ticket.Status,
            "Confirmed",
            StringComparison.OrdinalIgnoreCase);
    }

    // =========================================================
    // GET CANCELLATION CONTEXT
    // =========================================================

    public async Task<TicketResponse?> GetCancellationContextAsync(int ticketId)
    {
        if (ticketId <= 0)
            return null;

        var ticket = await _ticketRepository
            .GetByIdWithBookingAndTripAsync(ticketId);

        if (ticket == null)
            return null;

        if (ticket.Booking == null)
            throw new KeyNotFoundException("Booking not found.");

        if (ticket.Booking.Trip == null)
            throw new KeyNotFoundException("Trip not found.");

        return MapToResponse(ticket);
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

        var ticket = await _ticketRepository.GetByIdAsync(id);

        if (ticket == null)
            return false;

        if (string.Equals(
                ticket.Status,
                "Cancelled",
                StringComparison.OrdinalIgnoreCase))
        {
            throw new InvalidOperationException(
                "A cancelled ticket should not be deleted.");
        }

        return await _ticketRepository.DeleteAsync(id);
    }

    // =========================================================
    // MAP TICKET -> RESPONSE
    // =========================================================

    private static TicketResponse MapToResponse(Ticket ticket)
    {
        return new TicketResponse
        {
            // =================================================
            // TICKET
            // =================================================

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