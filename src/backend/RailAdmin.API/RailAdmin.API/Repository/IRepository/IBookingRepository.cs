using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync();

    Task<Booking?> GetByPNRAsync(string pnr);

    Task<IEnumerable<Booking>> GetByUserIdAsync(int userId);

    Task<bool> ExistsByPNRAsync(string pnr);

    Task<Booking> CreateAsync(Booking booking);

    Task<bool> UpdateStatusAsync(
        string pnr,
        string status);

    Task<bool> CancelAsync(string pnr);
}