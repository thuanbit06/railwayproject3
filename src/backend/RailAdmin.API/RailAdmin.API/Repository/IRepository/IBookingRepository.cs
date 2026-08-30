using RailAdmin.API.Models;

namespace RailAdmin.API.Repository.IRepository;

public interface IBookingRepository
{
    Task<IEnumerable<Booking>> GetAllAsync();

    Task<Booking?> GetByPNRAsync(
        string pnr);

    Task<IEnumerable<Booking>> GetByUserIdAsync(
        int userId);

    Task<Booking> CreateAsync(
        Booking booking);

    Task<bool> UpdateAsync(
        Booking booking);

    Task<bool> UpdateTotalAmountAsync(
        string pnr,
        decimal totalAmount);

    Task<bool> UpdateStatusAsync(
        string pnr,
        string status);

    Task<bool> DeleteAsync(
        string pnr);
}